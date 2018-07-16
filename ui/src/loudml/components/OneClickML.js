import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {notify as notifyAction} from 'shared/actions/notifications'
// import {errorThrown as errorThrownAction} from 'shared/actions/errors'

import {
    createModel as createModelApi,
    trainModel as trainModelApi,
} from 'src/loudml/apis'

import {
    modelCreated as modelCreatedAction,
    jobStart as jobStartAction,
} from "src/loudml/actions/view"

import {
    notifyModelCreated,
    notifyModelCreationFailed,
    notifyModelTraining,
    notifyModelTrainingFailed,
} from 'src/loudml/actions/notifications'

import {DEFAULT_MODEL} from 'src/loudml/constants'

const modelUID = () => {
    const number = Math.random() // 0.9394456857981651
    // number.toString(36); // '0.xtis06h6'
    return number.toString(36).substr(2, 9); // 'xtis06h6'
}

const OneClickML = ({
    timeRange,
    settings,
    modelActions: {
        modelCreated,
        jobStart,
    },
    notify,
}) => {
    const trainModel = async (name) => {
        const {
            lower,
            upper
        } = timeRange
        
        try {
            const res = await trainModelApi(name, lower, upper)
            const job = {
                name,
                id: res.data,
                type: 'training',
                state: 'waiting'
            }

            jobStart(job)
            notify(notifyModelTraining(job))
        } catch (error) {
            console.error(error)
            notify(notifyModelTrainingFailed(name, error))
        }
    }

    const createAndTrainModel = async () => {
        const model = {
            ...DEFAULT_MODEL,
            name: modelUID(),
            default_datasource: settings.database,
            features: { io: settings.fields.map(
                (field) => ({
                        name: field.alias,
                        measurement: settings.measurement,
                        field: field.args[0].value,
                        metric: field.value,
                        default: null,
                    })
                )
            },
        }

        try {
          await createModelApi(model)
          modelCreated(model)
          notify(notifyModelCreated(model.name))
          await trainModel(model.name)
        } catch (error) {
          console.error(error)
          notify(notifyModelCreationFailed(model.name, error))
        }
    }
    
    function oneClickModel() {
        createAndTrainModel()
    }

    return (
        <div className="btn btn-sm btn-default"
          onClick={oneClickModel}>
          <span className="icon loudml-bold">
          </span>
        </div>
    )
}

const {shape, func} = PropTypes

OneClickML.propTypes = {
    timeRange: shape(),
    settings: shape(),
    modelActions: shape({
        jobStart: func.isRequired,
    }).isRequired,
    notify: func.isRequired,
}

function mapStateToProps(state) {
    const {
        timeRange: {upper, lower},
        dataExplorerQueryConfigs,
        dataExplorer,
    } = state

    const config = (dataExplorer.queryIDs.length>0
        ? dataExplorerQueryConfigs[dataExplorer.queryIDs[0]]
        : null)

    return {
        timeRange: {upper, lower},
        settings: {
            measurement: config.measurement,
            database: config.database,
            fields: config.fields,
        },
    }
}

const mapDispatchToProps = dispatch => ({
    modelActions: {
        modelCreated: model => dispatch(modelCreatedAction(model)),
        jobStart: job => dispatch(jobStartAction(job)),
    },
    notify: message => dispatch(notifyAction(message)),
//    errorThrown: error => dispatch(errorThrownAction(error))
})

export default connect(mapStateToProps, mapDispatchToProps)(OneClickML)
