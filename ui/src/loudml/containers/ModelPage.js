import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {notify as notifyAction} from 'shared/actions/notifications'
import FancyScrollbar from 'shared/components/FancyScrollbar'
// import Notifications from 'shared/components/Notifications'
import SourceIndicator from 'shared/components/SourceIndicator'

import {
    getModel as getModelApi,
    createModel as createModelApi,
    updateModel as updateModelApi,
    trainModel as trainModelApi,
    getModelHooks as getModelHookApi,
    createModelHook as createModelHookApi,
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
    notifyModelTraining,
    notifyModelTrainingFailed,
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
            model: {
                ...props.model,
                features: FeaturesUtils.deserializedFeatures(props.model.features),
            },
            isCreating: props.params.name === undefined,
            annotation: false,
        }
    }

    componentDidMount = async () => {
        const {isCreating} = this.state
        const {params: {name}, notify, model} = this.props

        if (isCreating || model.name) {
            try {
                const {data: hooks} = await getModelHookApi(name)
                const hook = hooks.find(h => h === ANOMALY_HOOK_NAME)
                return this.setState(
                    {
                        isLoading: false,
                        annotation: (hook!==undefined),
                    }
                )
            } catch (error) {
                notify(notifyErrorGettingModel(parseError(error)))
                return this.setState({isLoading: false})
            }
        }

        try {
            const {data: {settings, state, training}} = await getModelApi(name)
            const {data: hooks} = await getModelHookApi(name)
            const hook = hooks.find(h => h === ANOMALY_HOOK_NAME)
            this.setState({
                model: {
                    ...DEFAULT_MODEL,
                    ...settings,
                    features: FeaturesUtils.deserializedFeatures(settings.features),
                },
                status: {...state},
                training,
                isLoading: false,
                annotation: (hook!==undefined),
            })
        } catch (error) {
            notify(notifyErrorGettingModel(parseError(error)))
            this.setState({isLoading: false})
        }
    }

    get validationError() {
        return null
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
        const {isCreating} = this.state

        const cb = (isCreating ? this._createModel : this._updateModel)

        this.setState(this._normalizeModel, cb)
    }

    _normalizeModel = (state) => ({
        model: state.model
    })

    _createModel = async () => {
        const {model, annotation} = this.state
        const {notify, modelActions: {modelCreated}} = this.props

        const serial = {
            ...model,
            features: FeaturesUtils.serializedFeatures(model.features)
        }

        try {
            await createModelApi(serial)
            if (annotation) {
                await createModelHookApi(model.name, createHook(ANOMALY_HOOK, model.default_datasource))
            }
            modelCreated(model)
            this._redirect()
            notify(notifyModelCreated(model.name))
        } catch (error) {
            console.error('ERROR')
            console.error(error)
            notify(notifyModelCreationFailed(model.name, parseError(error)))
        }
    }

    _updateModel = async () => {
        const {model, annotation} = this.state
        const {notify, modelActions: {modelUpdated}} = this.props

        const serial = {
            ...model,
            features: FeaturesUtils.serializedFeatures(model.features)
        }

        try {
            await updateModelApi(serial)
            if (annotation) {
                await createModelHookApi(model.name, createHook(ANOMALY_HOOK, model.default_datasource))
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

    train = (from, to) => {
        const {notify, modelActions: {jobStart}} = this.props
        const {model} = this.state

        trainModelApi(model.name, from, to)
            .then(res => {
                jobStart({
                    name: model.name,
                    id: res.data,
                    type: 'training',
                    state: 'waiting'
                })
                notify(notifyModelTraining())
            })
            .catch(error => {
                notify(notifyModelTrainingFailed(model.name, parseError(error)))
            })
    }

    render() {
        const {isLoading, isCreating, model, annotation} = this.state

        return (
            <div className="page">
                <div className="page-header">
                    <div className="page-header__container">
                        <div className="page-header__left">
                            <h1 className="page-header__title">
                                {isCreating ? 'Add a new model' : 'Configure model'}
                            </h1>
                        </div>
                        <div className="page-header__right">
                            <SourceIndicator />
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
                                            name={isCreating ? 'Model creator' : model.name}
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
                                        onTrain={this.train}
                                        isCreating={isCreating}
                                        annotation={annotation}
                                        onAnnotationChange={this.onAnnotationChange}
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

const {func, shape, string} = PropTypes

ModelPage.propTypes = {
    params: shape({
        name: string,
    }),
    model: shape({}),
    source: PropTypes.shape({}),
    router: shape({
        push: func.isRequired,
    }).isRequired,
    notify: func.isRequired,
    modelActions: PropTypes.shape({
        modelCreated: PropTypes.func.isRequired,
        modelUpdated: PropTypes.func.isRequired,
    }).isRequired,
}

function mapStateToProps(state, ownProps) {
    const { models } = state.loudml.models
    const { params: {name}} = ownProps

    // get model from state if exists...
    const stateModel = (models && models.find(model => model.settings.name === name))
    
    return {
        model: {
            ...DEFAULT_MODEL, // default init 
            ...(stateModel&&stateModel.settings),
        },
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
