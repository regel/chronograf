import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {notify as notifyAction} from 'shared/actions/notifications'
import FancyScrollbar from 'shared/components/FancyScrollbar'
import SourceIndicator from 'shared/components/SourceIndicator'
import QuestionMark from 'src/loudml/components/QuestionMark'

import {
    getModel as getModelApi,
    createModel as createModelApi,
    updateModel as updateModelApi,
    getModelHooks as getModelHookApi,
    createModelHook as createModelHookApi,
    deleteModelHook as deleteModelHookApi,
    getDatasources as getDatasourcesApi,
} from 'src/loudml/apis'
import {
    modelCreated as modelCreatedAction,
    modelUpdated as modelUpdatedAction,
} from "src/loudml/actions/view"
import ModelHeader from 'src/loudml/components/ModelHeader'
import ModelTabs from 'src/loudml/components/ModelTabs'
import FeaturesUtils from 'src/loudml/components/FeaturesUtils'

import {
    notifyErrorGettingModel,
    notifyModelCreated,
    notifyModelCreationFailed,
    notifyModelUpdated,
    notifyModelUpdateFailed,
    notifyErrorGettingDatasources,
    notifyErrorGettingModelHook,
} from 'src/loudml/actions/notifications'
import {parseError} from 'src/loudml/utils/error'
import {createHook} from 'src/loudml/utils/hook'

import {DEFAULT_MODEL} from 'src/loudml/constants'
import {ANOMALY_HOOK_NAME, ANOMALY_HOOK} from 'src/loudml/constants/anomaly'

class ModelPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            annotation: false,
            datasources: [],
            training: {},
            state: {},
        }
    }

    componentDidMount = async () => {
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

        const cb = this.loadDatasources

        if (name&&model) {
            // Cloned (isEditing) or in state
            const {settings, state, training} = model
            const isEditing = settings.isEditing||false
            const annotation = (isEditing
                ?settings.annotation
                :await this.hasHook(name))
            return this.setState({
                isLoading: false,
                isEditing,
                model: {
                    ...settings,
                    features: FeaturesUtils.deserializedFeatures(settings.features),
                },
                state,
                training: training||{},
                annotation,
            }, cb)
        }

        if (!name) {
            // new
            try {
                return this.setState(
                    {
                        isLoading: false,
                        isEditing: true,
                        model: {
                            ...model,
                            features: FeaturesUtils.deserializedFeatures(model.features),
                        },
                    },
                    cb
                )
            } catch (error) {
                notify(notifyErrorGettingModel(parseError(error)))
                return this.setState({isLoading: false}, cb)
            }
        }

        try {
            // fetch
            const {data: {settings, state, training}} = await getModelApi(name)
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
            }, cb)
        } catch (error) {
            notify(notifyErrorGettingModel(parseError(error)))
            this._redirect()
        }
    }

    loadDatasources = async () => {
        const {notify} = this.props

        try {
            const {data: datasources} = await getDatasourcesApi()
            const filtered = datasources.filter(ds => ds.type === 'influxdb')
            this.setState({datasources: filtered})
        } catch (error) {
            notify(notifyErrorGettingDatasources(parseError(error)))
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

        if (!model.default_datasource) {
            return 'Please choose a datasource'
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

    onDatasourceChoose = datasource => {
        const {model} = this.state

        model.default_datasource = datasource
        this.setState({model})
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
            features: FeaturesUtils.serializedFeatures(model.features)
        }
    }

    _createModel = async (model) => {
        const {annotation} = this.state
        const {notify, modelActions: {modelCreated}} = this.props

        try {
            await createModelApi(model)
            if (annotation) {
                await createModelHookApi(model.name, createHook(ANOMALY_HOOK, model.default_datasource))
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
                await createModelHookApi(model.name, createHook(ANOMALY_HOOK, model.default_datasource))
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

    onAnnotationChange = (e) => {
        const {checked} = e.target
        this.setState({annotation: checked})
    }

    render() {
        const {
            isLoading,
            isEditing,
            model,
            annotation,
            datasources,
            training,
            state,
        } = this.state

        return (
            <div className="page">
                <div className="page-header">
                    <div className="page-header__container">
                        <div className="page-header__left">
                            <h1 className="page-header__title">
                                {isEditing ? 'Add a new model' : 'Configure model'}
                            </h1>
                        </div>
                        <div className="page-header__right">
                            <SourceIndicator />
                            <QuestionMark />
                        </div>
                    </div>
                </div>
                <FancyScrollbar className="page-contents">
                    {isLoading ? (
                        <div className="page-spinner" />
                    ) : (
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="col-md-12">
                                        <ModelHeader
                                            name={isEditing ? 'Model creator' : model.name}
                                            onSave={this.handleSave}
                                            validationError={this.validationError}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <ModelTabs
                                        model={model}
                                        onInputChange={this.onInputChange}
                                        onDatasourceChoose={this.onDatasourceChoose}
                                        isEditing={isEditing}
                                        annotation={annotation}
                                        onAnnotationChange={this.onAnnotationChange}
                                        datasources={datasources}
                                        datasource={datasources.find(ds => ds.name === model.default_datasource)}
                                        locked={
                                            ['running', 'done'].includes(training.state)
                                            ||state.trained
                                            ||false
                                            }
                                        />
                                </div>
                            </div>
                        </div>
                    )}
                </FancyScrollbar>
            </div>
        )
    }
}

const {func, shape, string, arrayOf} = PropTypes

ModelPage.propTypes = {
    params: shape({
        name: string,
    }),
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

function mapStateToProps(state, ownProps) {
    const { models } = state.loudml.models
    const {
        params: {name},
        router,
    } = ownProps

    return {
        name,
        models,
        router,
    }
}

const mapDispatchToProps = dispatch => ({
    modelActions: {
        modelCreated: model => dispatch(modelCreatedAction(model)),
        modelUpdated: model => dispatch(modelUpdatedAction(model)),
    },
    notify: message => dispatch(notifyAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelPage)
