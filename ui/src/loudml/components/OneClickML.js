import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import uuid from 'uuid'
import classnames from 'classnames'

import ReactTooltip from 'react-tooltip'

import {notify as notifyAction} from 'shared/actions/notifications'
import {SourceContext} from 'src/CheckSources'

import {convertTimeRange} from 'src/loudml/utils/timerange'
import {parseError} from 'src/loudml/utils/error'
import {createHook} from 'src/loudml/utils/hook'
import {
    normalizeInterval,
    normalizeFeatureDefault,
    normalizeSpan,
} from 'src/loudml/utils/model'
import {
    createModel,
    trainAndStartModel,
    createAndGetBucket,
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

import {DEFAULT_MODEL} from 'src/loudml/constants'
import {ANOMALY_HOOK} from 'src/loudml/constants/anomaly'

const SELECT_FEATURE = 'Select one field'
const SELECT_BUCKET_INTERVAL = 'Select a \'Group by\' value'
const SELECT_ONLY_ONE_TAG_VALUE = 'Select only one value per tag'
const LINEAR_NOTSUPPORTED = 'Linear mode not supported'

const formatNotification = s => `<code>${s}</code>`

const notifyFeature = fields => {
    const feature = (
        (
            fields
            &&fields.length===1
            &&formatNotification(`${fields[0].value}(${fields[0].args[0].value})`)
        )
    )||SELECT_FEATURE
    return `<h1>Feature:</h1><p>${feature}</p>`
}

const notifyInterval = time => {
    const interval = (
            time!==null
            &&time!=='auto'
            &&formatNotification(time)
    )||SELECT_BUCKET_INTERVAL
    return `<h1>groupBy bucket interval:</h1><p>${interval}</p>`
}

const notifyMatch = tags => {
    const entries = Object.entries(tags)

    if (entries.some(e => e[1].length>1)) {
        // tag selected on multiple values
        return `<h1>Match all:</h1><p>${SELECT_ONLY_ONE_TAG_VALUE}</p>`
    }

    if (entries.length>0) {
        const matches = entries
            .map(e => {
                const [tag, values] = e
                return formatNotification(`${tag}:${values[0]}`)
                }).join('')
        return `<h1>Match all:</h1><p>${matches}</p>`
    }

    return ''
}

const notifyFillValue = fill => {
    fill = (
        fill==='linear'
        ?LINEAR_NOTSUPPORTED
        :formatNotification(fill==='none'?null:fill)
    )
    return `<h1>Fill value:</h1><p>${fill}</p>`
}

const notifyTagsAccepted = areTagsAccepted => {
    if (areTagsAccepted===false) {
        return '<h1>Tags:</h1><p>Tags must be set to \'equal to\'</p>'
    }

    return ''
}

const checkTags = (tags) => 
    // really length > 1. Can we have zero length?
     Object.values(tags).some(v => v.length>1) === false


const tagsToName = (tags) => {
    const entries = Object.entries(tags)
        .map(([k, v]) => (`${k}_${v.map(i => (i.replace(/[.-]/g, '_'))).join('_')}`))
    if (entries.length) {
        return entries.join('_')
    }
    return null
}



class OneClickML extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            uuidTooltip: uuid.v4(),
        }
        this.oneClickModel = this.oneClickModel.bind(this);
    }

    render() {
        const {uuidTooltip} = this.state

        return (
            <SourceContext.Consumer>
              {(source) => (
                <div className={classnames('btn', 'btn-sm', 'btn-default', {
                    'disabled': !this.isValid,
                    })}
                    onClick={this.oneClickModel.bind(this, source)}
                    data-for={uuidTooltip}
                    data-tip={this.sourceNameTooltip}
                >
                    <span className="icon loudml-gradcap" />
                    Create Baseline
                    <ReactTooltip
                        id={uuidTooltip}
                        effect="solid"
                        html={true}
                        place="bottom"
                        class="influx-tooltip"
                    />
                </div>
            )}
            </SourceContext.Consumer>
        )
          
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

    get name() {
        const {
            settings: {
                database,
                measurement,
                fields,
                groupBy: {time},
                tags,
            }
        } = this.props
        return [
            database,
            measurement,
            fields[0].value,
            fields[0].args[0].value,
            tagsToName(tags),
            time
        ].join('_')
    }

    _createAndTrainModel = async (source) => {
        const {
            settings: {
                database,
                retentionPolicy, 
                groupBy: {time},
                fields,
                measurement,
                tags,
                fill,
            },
            modelActions: {modelCreated},
            notify,
        } = this.props
        const bucket = await createAndGetBucket(
            database, retentionPolicy, measurement, source)
        const model = {
            ...DEFAULT_MODEL,
            max_evals: 10,
            name: this.name,
            interval: normalizeInterval(time),
            span: normalizeSpan(time),
            default_bucket: bucket.name,
            bucket_interval: time,
            features: fields.map(
                (field) => ({
                        name: field.alias,
                        measurement,
                        field: field.args[0].value,
                        metric: field.value,
                        io: 'io',
                        default: normalizeFeatureDefault(fill),
                        match_all: Object
                            .keys(tags)
                            .map(k => tags[k]
                                    .map(v => ({
                                            tag: k,
                                            value: v,
                                        })))
                            .reduce((a, v) => [...a, ...v], []),
                    })
                ),
        }

        try {
            await createModel(model)
            await createModelHook(model.name, createHook(ANOMALY_HOOK, model.default_bucket))
            modelCreated(model)
            notify(notifyModelCreated(model.name))
            this._trainModel(model.name)
        } catch (error) {
            console.error(error)
            notify(notifyModelCreationFailed(model.name, parseError(error)))
        }
    }
    
    oneClickModel = (source) => {
        if (this.isValid) {
            this._createAndTrainModel(source)
        }
    }

    get sourceNameTooltip() {
        const formatStaticTip = text => (`<div><span>${text}</span></div>`)

        const {
            settings: {
                fields,
                groupBy: {time},
                tags,
                fill,
                areTagsAccepted,
            }
        } = this.props
        
        const isCheckTags = checkTags(tags)
        const checkTagsAccepted = (Object.keys(tags).length>0 && isCheckTags
        ? areTagsAccepted
        : true)  // don't care
        
        return [
            formatStaticTip('Use your current data selection to baseline normal metric behavior using a machine learning task.'),
            formatStaticTip('This will create a new model, and run training to fit the baseline to your data.'),
            formatStaticTip('You can visualise the baseline, and forecast future data using the Loud ML tab on the left panel once training is completed.'),
            '<br/>',
            notifyFeature(fields),
            notifyInterval(time),
            notifyMatch(tags),
            notifyFillValue(fill),
            notifyTagsAccepted(checkTagsAccepted),
        ].join('')
    }

    get isValid() {
        const {settings: {
            fields,
            groupBy: {time},
            tags,
            fill,
            areTagsAccepted,
        }} = this.props
        const isCheckTags = checkTags(tags)
        const checkTagsAccepted = (Object.keys(tags).length>0 && isCheckTags
        ? areTagsAccepted
        : true)  // don't care

        return (fields&&fields.length===1)
            && (time!==null&&time!=='auto')
            && (isCheckTags===true)
            && (fill!=='linear')
            && (checkTagsAccepted)
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

    const settings = (dataExplorer.queryIDs.length>0
        ? dataExplorerQueryConfigs[dataExplorer.queryIDs[0]]
        : null)

    return {
        timeRange: {upper, lower},
        settings,
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
