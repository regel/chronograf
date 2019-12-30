import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

import {notify as notifyAction} from 'shared/actions/notifications'
import FancyScrollbar from 'shared/components/FancyScrollbar'
import PageHeader from 'src/reusable_ui/components/page_layout/PageHeader'
import QuestionMark from 'src/loudml/components/QuestionMark'

import GeneralPanel from 'src/loudml/components/GeneralPanel'
import FeaturesPanel from 'src/loudml/components/FeaturesPanel'
import PredictionPanel from 'src/loudml/components/PredictionPanel'
import AnomalyPanel from 'src/loudml/components/AnomalyPanel'
import AboutPanel from 'src/loudml/components/AboutPanel';

import {
    getModel as getModelApi,
    createModel as createModelApi,
    updateModel as updateModelApi,
    getBuckets as getBucketsApi,
    getModelHooks as getModelHookApi,
    createModelHook as createModelHookApi,
    deleteModelHook as deleteModelHookApi,
    getVersion as getVersionApi,
} from 'src/loudml/apis'
import {
    modelCreated as modelCreatedAction,
    modelUpdated as modelUpdatedAction,
} from "src/loudml/actions/view"
import ModelHeader from 'src/loudml/components/ModelHeader'
import ModelTabs from 'src/loudml/components/ModelTabs'
import FeaturesUtils from 'src/loudml/components/FeaturesUtils'

import {
    notifyErrorGettingVersion,
    notifyErrorGettingModel,
    notifyModelCreated,
    notifyModelCreationFailed,
    notifyModelUpdated,
    notifyModelUpdateFailed,
    notifyErrorGettingBuckets,
    notifyErrorGettingModelHook,
} from 'src/loudml/actions/notifications'
import {parseError} from 'src/loudml/utils/error'
import {createHook} from 'src/loudml/utils/hook'

import {DEFAULT_MODEL, MODEL_TYPE_LIST} from 'src/loudml/constants'
import {ANOMALY_HOOK_NAME, ANOMALY_HOOK} from 'src/loudml/constants/anomaly'

import 'src/loudml/styles/model.scss'
import 'src/loudml/styles/notification.scss'
import ParametersPanel from '../components/ParametersPanel';

class ModelPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            annotation: false,
            buckets: [],
            training: {},
            state: {},
            activeSection: 'general',
        }
    }

    async componentDidMount() {
        const {
            params: {name},
            notify,
            models,
        } = this.props

        /*
         * named if requested from route or cloned
         * else new
         */
        const model = (name
            ?models.find(m => m.settings.name === name)
            :{...DEFAULT_MODEL}
        )

        this.getVersion()

        if (name&&model) {
            // Cloned (isEditing) or in state
            const {settings, state, training} = model
            const isEditing = settings.isEditing||false
            const annotation = (isEditing
                ?settings.annotation
                :await this.hasHook(name))
            this.setState({
                isLoading: false,
                isEditing,
                model: {
                    ...settings,
                    features: FeaturesUtils.deserializedFeatures(settings.features),
                },
                state,
                training: training||{},
                annotation,
            })
            this.loadBuckets()
            return
        }

        if (!name) {
            // new
            try {
                this.setState(
                    {
                        isLoading: false,
                        isEditing: true,
                        model: {
                            ...model,
                            features: FeaturesUtils.deserializedFeatures(model.features),
                        },
                    },
                )
                this.loadBuckets()
                return
            } catch (error) {
                notify(notifyErrorGettingModel(parseError(error)))
                this.setState({isLoading: false})
                this.loadBuckets()
            }
        }

        try {
            // fetch
            const {data: [{settings, state, training}]} = await getModelApi(name)
            const annotation = await this.hasHook(name)
            this.setState({
                model: {
                    ...settings,
                    features: FeaturesUtils.deserializedFeatures(settings.features),
                },
                state,
                training: training||{},
                isLoading: false,
                isEditing: false,
                annotation,
            })
            this.loadBuckets()
            return
        } catch (error) {
            notify(notifyErrorGettingModel(parseError(error)))
            this._redirect()
        }
    }

    render() {
        const {
            isLoading,
            isEditing,
            model,
            activeSection,
        } = this.state

        return (
            <div className="page">
                <PageHeader
                    titleText={isEditing ? 'Add a new model' : 'Configure model'}
                    sourceIndicator={true}
                    optionsComponents={(<QuestionMark />)}
                    />
                <FancyScrollbar className="page-contents">
                    {isLoading ? (
                        <div className="container-fluid">
                            <div className="page-spinner" />
                        </div>
                    ) : (
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12">
                                    <ModelHeader
                                        name={model.name}
                                        isEditing={isEditing}
                                        onEdit={this.onInputChange}
                                        onSave={this.handleSave}
                                        validationError={this.validationError}
                                        />
                                </div>
                            </div>
                            <ModelTabs
                                sections={this.modelSubSections}
                                activeSection={activeSection}
                                onTabClick={this.handleTabClick}
                                />
                        </div>
                    )}
                </FancyScrollbar>
            </div>
        )
    }

    getVersion = async () => {
        const {notify} = this.props

        try {
            const {data: {version}} = await getVersionApi()
            this.setState({version})
        } catch (error) {
            notify(notifyErrorGettingVersion(parseError(error)))
        }
    }

    loadBuckets = async () => {
        const {notify} = this.props

        try {
            const {data: buckets} = await getBucketsApi()
            const filtered = buckets.filter(ds => ds.type === 'influxdb')
            this.setState({buckets: filtered})
        } catch (error) {
            notify(notifyErrorGettingBuckets(parseError(error)))
        }
    }

    hasHook = async (name) => {
        const {notify} = this.props

        try {
            const {data: hooks} = await getModelHookApi(name)
            const hook = hooks.find(h => h === ANOMALY_HOOK_NAME)
            return (hook!==undefined)
        } catch (error) {
            notify(notifyErrorGettingModelHook(name, ANOMALY_HOOK_NAME, parseError(error)))
        }
        return false
    }

    get validationError() {
        const {model} = this.state
        
        if (!model.name) {
            return 'Your model has no name'
        }

        if (!model.default_bucket) {
            return 'Please choose a bucket'
        }

        if (model.features.some(f => f.isEditing)) {
            return 'A feature is edited'
        }

        if (model.features.some(f => !f.field)) {
            return 'A feature has no field'
        }

        return ''
    }

    onInputChange = e => {
        const {name, type, value} = e.target

        this.handleEdit(name, type === 'number' ? Number(value) : value)
    }

    onDropdownChoose = (field, value) => {
        this.handleEdit(field, value)
    }

    onThresholdChange = (field, value) => {
        const num = value
        let fixed = Math.min(100, num)
        if (fixed!==0) {
            fixed = Math.max(0.1, fixed)
        }

        this.handleEdit(field, fixed)
    }

    handleEdit = (field, value) => {
        this.setState(prevState => {
            const model = {
                ...prevState.model,
                [field]: value,
            }

            return {...prevState, model}
        })
    }

    handleSave = () => {

        const cb =(this.state.isEditing
            ?this._createModel
            :this._updateModel)
        cb(this._normalizeModel())
    }

    _normalizeModel = () => {
        const {model} = this.state

        delete model.isEditing
        delete model.annotation

        return {
            ...model,
        }
    }

    _createModel = async (model) => {
        const {annotation} = this.state
        const {notify, modelActions: {modelCreated}} = this.props

        try {
            await createModelApi(model)
            if (annotation) {
                await createModelHookApi(model.name, createHook(ANOMALY_HOOK, model.default_bucket))
            }
            modelCreated(model)
            this._redirect()
            notify(notifyModelCreated(model.name))
        } catch (error) {
            notify(notifyModelCreationFailed(model.name, parseError(error)))
        }
    }

    _updateModel = async (model) => {
        const {annotation} = this.state
        const {
            notify,
            modelActions: {modelUpdated},
        } = this.props

        try {
            await updateModelApi(model)
            const {data: hooks} = await getModelHookApi(model.name)
            const hook = hooks.find(h => h === ANOMALY_HOOK_NAME)
            if (annotation && !hook) {
                await createModelHookApi(model.name, createHook(ANOMALY_HOOK, model.default_bucket))
            }
            if (!annotation && hook) {
                await deleteModelHookApi(model.name, ANOMALY_HOOK_NAME)
            }
            modelUpdated(model)
            this._redirect()
            notify(notifyModelUpdated(model.name))
        } catch (error) {
            notify(notifyModelUpdateFailed(model.name, parseError(error)))
        }
    }

    _redirect = () => {
        const {source: {id}, router} = this.props

        router.push(`/sources/${id}/loudml`)
    }

    onAnnotationChange = (checked) => {
        // const {checked} = e.target
        this.setState({annotation: checked})
    }

    get isLocked() {
        const {training, state} = this.state

        return (
            ['running', 'done'].includes(training.state)
            ||state.trained
            ||false)
    }

    get modelSubSections() {
        const {
            model,
            annotation,
            buckets,
            version,
        } = this.state

        const bucket = buckets.find(ds => ds.name === model.default_bucket)
        const locked = this.isLocked

        return [
            {
                name: 'General',
                url: 'general',
                enabled: true,
                component: (
                    <GeneralPanel
                        model={model}
                        onDropdownChoose={this.onDropdownChoose}
                        onEdit={this.handleEdit}
                        buckets={buckets}
                        modelTypes={MODEL_TYPE_LIST}
                        locked={locked}
                        />
                ),
            },
            {
                name: 'Parameters',
                url: 'parameters',
                enabled: true,
                component: (
                    <ParametersPanel
                        model={model}
                        onInputChange={this.onInputChange}
                        locked={locked}
                        />
                ),
            },
            {
                name: 'Features',
                url: 'features',
                enabled: true,
                component: (
                    <FeaturesPanel
                        features={model.features}
                        onInputChange={this.onInputChange}
                        bucket={bucket}
                        locked={locked}
                    />
                ),
            },
            {
                name: 'Predictions',
                url: 'predictions',
                enabled: true,
                component: (
                    <PredictionPanel
                        model={model}
                        onInputChange={this.onInputChange}
                    />
                )
            },
            {
                name: 'Anomalies',
                url: 'anomalies',
                enabled: true,
                component: (
                    <AnomalyPanel
                        model={model}
                        annotation={annotation}
                        onThresholdChange={this.onThresholdChange}
                        onAnnotationChange={this.onAnnotationChange}
                    />
                )
            },
            {
                name: 'About',
                url: 'about',
                enabled: true,
                component: (
                    <AboutPanel
                        version={version}
                    />
                )
            },
        ]
        
    }

    handleTabClick = url => () => {
        this.setState({activeSection: url})
    }

}

const {func, shape, arrayOf} = PropTypes

ModelPage.propTypes = {
    params: shape({}),
    models: arrayOf(shape({})),
    training: shape(),
    source: shape({}),
    router: shape({
        push: func.isRequired,
    }).isRequired,
    notify: func.isRequired,
    modelActions: shape({
        modelCreated: func.isRequired,
        modelUpdated: func.isRequired,
    }).isRequired,
}

function mapStateToProps(state) {
    const { models } = state.loudml.models

    return {
        models,
    }
}

const mapDispatchToProps = dispatch => ({
    modelActions: {
        modelCreated: model => dispatch(modelCreatedAction(model)),
        modelUpdated: model => dispatch(modelUpdatedAction(model)),
    },
    notify: message => dispatch(notifyAction(message))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ModelPage))
