import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import _ from 'lodash'
import {getModel, createModel, updateModel} from 'src/loudml/apis'
import {
  addModel as addModelAction,
  updateModel as updateModelAction,
} from 'src/loudml/actions'
import {notify as notifyAction} from 'shared/actions/notifications'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Notifications from 'shared/components/Notifications'
import ModelForm from 'src/loudml/components/ModelForm'
import FancyScrollbar from 'shared/components/FancyScrollbar'
import {DEFAULT_MODEL} from 'src/loudml/constants'

import {
  notifyErrorGettingModel,
  notifyModelCreated,
  notifyModelCreationFailed,
  notifyModelUpdated,
  notifyModelUpdateFailed,
} from 'src/loudml/notifications'

class ModelPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      model: DEFAULT_MODEL,
      editMode: props.params.name !== undefined,
    }
  }

  componentDidMount() {
    const {editMode} = this.state
    const {params, notify} = this.props

    if (!editMode) {
      return this.setState({isLoading: false})
    }

    getModel(params.name)
      .then(({data: model}) => {
        this.setState({
          model: {...DEFAULT_MODEL, ...model},
          isLoading: false,
        })
      })
      .catch(error => {
        notify(notifyErrorGettingModel(this._parseError(error)))
        this.setState({isLoading: false})
      })
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

  handleSubmit = e => {
    e.preventDefault()
    const {isCreated, editMode} = this.state

    if (!isCreated && !editMode) {
      return this.setState(this._normalizeModel, this._createModel)
    }

    this.setState(this._normalizeModel, this._updateModel)
  }

  _normalizeModel({model}) {
    return model
  }

  _createModelOnBlur = () => {
    const {model} = this.state
    createModel(model)
      .then(({data: modelFromServer}) => {
        this.props.addModel(modelFromServer)
        this.setState({
          model: {...DEFAULT_MODEL, ...modelFromServer},
          isCreated: true,
        })
      })
      .catch(err => {
        // dont want to flash this until they submit
        const error = this._parseError(err)
        console.error('Error creating model: ', error)
      })
  }

  _createModel = () => {
    const {model} = this.state
    const {notify} = this.props

    createModel(model)
      .then(({data: modelFromServer}) => {
        this.props.addModel(modelFromServer)
        this._redirect(modelFromServer)
        notify(notifyModelCreated(model.name))
      })
      .catch(error => {
        console.error('ERROR')
        console.error(error)
        notify(notifyModelCreationFailed(model.name, this._parseError(error)))
      })
  }

  _updateModel = () => {
    const {model} = this.state
    const {notify} = this.props
    updateModel(model)
      .then(({data: modelFromServer}) => {
        this.props.updateModel(modelFromServer)
        this._redirect(modelFromServer)
        notify(notifyModelUpdated(model.name))
      })
      .catch(error => {
        notify(notifyModelUpdateFailed(model.name, this._parseError(error)))
      })
  }

  _redirect = () => {
    const {params, router} = this.props

    router.push(`/sources/${params.sourceID}/loudml`)
  }

  _redirectToApp = source => {
    const {location, router} = this.props
    const {redirectPath} = location.query

    if (!redirectPath) {
      return router.push(`/sources/${source.id}/hosts`)
    }

    const fixedPath = redirectPath.replace(
      /\/sources\/[^/]*/,
      `/sources/${source.id}`
    )
    return router.push(fixedPath)
  }

  _parseError = error => {
    return _.get(error, ['data', 'message'], _.get(error, ['data'], error))
  }

  render() {
    const {isLoading, model, editMode} = this.state

    if (isLoading) {
      return <div className="page-spinner" />
    }

    return (
      <div className="page">
        <Notifications />
        <div className="page-header">
          <div className="page-header__container page-header__source-page">
            <div className="page-header__col-md-8">
              <div className="page-header__left">
                <h1 className="page-header__title">
                  {editMode ? 'Configure model' : 'Add a new model'}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <FancyScrollbar className="page-contents">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <div className="panel">
                  <ModelForm
                    model={model}
                    editMode={editMode}
                    onEdit={this.handleEdit}
                    onSubmit={this.handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </FancyScrollbar>
      </div>
    )
  }
}

const {func, shape, string} = PropTypes

ModelPage.propTypes = {
  params: shape({
    id: string,
    sourceID: string,
  }),
  router: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    query: shape({
      redirectPath: string,
    }).isRequired,
  }).isRequired,
  notify: func.isRequired,
  addModel: func.isRequired,
  updateModel: func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  notify: bindActionCreators(notifyAction, dispatch),
  addModel: bindActionCreators(addModelAction, dispatch),
  updateModel: bindActionCreators(updateModelAction, dispatch),
})
export default connect(null, mapDispatchToProps)(withRouter(ModelPage))
