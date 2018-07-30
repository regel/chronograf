import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import uuid from 'uuid'
import classnames from 'classnames'

import ReactTooltip from 'react-tooltip'

import {notify as notifyAction} from 'shared/actions/notifications'

import {convertTimeRange} from 'src/loudml/utils/timerange'
import {parseError} from 'src/loudml/utils/error'
import {createHook} from 'src/loudml/utils/hook'
import {normalizeInterval} from 'src/loudml/utils/model'
import {
    createModel,
    trainAndStartModel,
    getDatasources,
    createModelHook,
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

import {
    UNDEFINED_DATASOURCE,
    notifyDatasource,
    SELECT_FEATURE,
    notifyFeature,
    SELECT_BUCKET_INTERVAL,
    notifyInterval,
} from 'src/loudml/actions/oneclick'

import {DEFAULT_MODEL} from 'src/loudml/constants'
import {ANOMALY_HOOK} from 'src/loudml/constants/anomaly'

const modelUID = () => {
    const number = Math.random() // 0.9394456857981651
    // number.toString(36); // '0.xtis06h6'
    return number.toString(36).substr(2, 9); // 'xtis06h6'
}

class OneClickML extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            datasource: null,
            uuidTooltip: uuid.v4(),
        }
    }

    componentDidMount() {
        this._getDatasource()
    }

    componentDidUpdate(prevProps) {
        if (this.props.settings.database !== prevProps.settings.database) {
            this._getDatasource();
        }
    }

    _trainModel = async (name) => {
        const {
            timeRange,
            modelActions: {jobStart},
            notify,
        } = this.props
        const {
            lower,
            upper
        } = convertTimeRange(timeRange)
        
        try {
            const res = await trainAndStartModel(name, lower, upper)
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
            notify(notifyModelTrainingFailed(name, parseError(error)))
        }
    }


    _getDatasource = async () => {
        const {settings: {database}} = this.props
        const {data} = await getDatasources()
        const datasource = data.find(d => d.database === database)
        this.setState({datasource: datasource&&datasource.name})
    }

    _createAndTrainModel = async () => {
        const {
            settings,
            modelActions: {modelCreated},
            notify,
        } = this.props
        const {datasource} = this.state
        const model = {
            ...DEFAULT_MODEL,
            max_evals: 10,
            name: modelUID(),
            interval: normalizeInterval(settings.groupBy.time),
            default_datasource: datasource,
            bucket_interval: settings.groupBy.time,
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
          await createModel(model)
          await createModelHook(model.name, createHook(ANOMALY_HOOK, model.default_datasource))
          modelCreated(model)
          notify(notifyModelCreated(model.name))
          await this._trainModel(model.name)
        } catch (error) {
          console.error(error)
          notify(notifyModelCreationFailed(model.name, parseError(error)))
        }
    }
    
    oneClickModel = () => {
        if (this.isValid) {
            this._createAndTrainModel()
        }
    }

    get sourceNameTooltip() {
        const {settings: {
            fields,
            groupBy: {time},
        }} = this.props
        const {datasource} = this.state
        const connection = notifyDatasource((datasource ? `<code>${datasource}</code>` : UNDEFINED_DATASOURCE))
        const feature = notifyFeature((fields&&fields.length===1 ? `<code>${fields[0].value}(${fields[0].args[0].value})</code>` : SELECT_FEATURE))
        const bucket = notifyInterval((time===null||time==='auto' ? SELECT_BUCKET_INTERVAL : `<code>${time}</code>`))
        return connection+feature+bucket
    }

    get isValid() {
        const {settings: {
            fields,
            groupBy: {time},
        }} = this.props
        const {datasource} = this.state
        return (datasource!==undefined)
            && (fields&&fields.length===1)
            && (time!==null&&time!=='auto')
    }

    render() {
        const {uuidTooltip} = this.state
        return (
            <div className={classnames('btn', 'btn-sm', 'btn-default', {
                'disabled': !this.isValid,
                })}
                onClick={this.oneClickModel}
                data-for={uuidTooltip}
                data-tip={this.sourceNameTooltip}
            >
                <span className="icon loudml-bold" />
                1-Click ML
                <ReactTooltip
                    id={uuidTooltip}
                    effect="solid"
                    html={true}
                    place="left"
                    class="influx-tooltip"
                />
            </div>
        )
    }
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
            groupBy: config.groupBy,
        },
    }
}

const mapDispatchToProps = dispatch => ({
    modelActions: {
        modelCreated: model => dispatch(modelCreatedAction(model)),
        jobStart: job => dispatch(jobStartAction(job)),
    },
    notify: message => dispatch(notifyAction(message)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OneClickML)
