import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {
  loadModelsAsync,
  removeAndLoadModels,
} from 'src/loudml/actions'

import FancyScrollbar from 'shared/components/FancyScrollbar'
import DeleteConfirmTableCell from 'shared/components/DeleteConfirmTableCell'

import {notify as notifyAction} from 'shared/actions/notifications'

import {
  notifyModelDeleted,
  notifyModelDeleteFailed,
} from 'src/loudml/notifications'

class LoudMLPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {loadModels} = this.props
    loadModels()
  }

  handleDeleteModel = model => {
    const {notify} = this.props
    const {name} = model.settings

    try {
      this.props.removeAndLoadModels(name)
      notify(notifyModelDeleted())
    } catch (e) {
      notify(notifyModelDeleteFailed(name))
    }
  }

  renderModelsTable() {
    const {models, source} = this.props

    return models && models.length ? (
      <table className="table v-center mdels-table table-highlight">
        <thead>
          <tr>
            <th>Name</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {models.sort(m => m.settings.name).map(model => (
            <tr key={model.settings.name}>
              <td>
                <Link to={`/sources/${source.id}/loudml/models/${model.settings.name}/edit`}>
                  {model.settings.name}
                </Link>
              </td>
              <DeleteConfirmTableCell
                onDelete={this.handleDeleteModel}
                item={model}
                buttonSize="btn-xs"
              />
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="generic-empty-state">
        <h4 style={{marginTop: '90px'}}>
          Looks like you don’t have any model
        </h4>
        <br />
        <Link
          to="loudml/models/new"
          className="btn btn-sm btn-primary"
          style={{marginBottom: '90px'}}
        >
          <span className="icon plus" /> Create model
        </Link>
      </div>
    )
  }

  render() {
    const {models, source} = this.props
    let title

    if (models === null) {
      title = 'Loading Model...'
    } else if (models.length === 1) {
      title = '1 Model'
    } else {
      title = `${models.length} Models`
    }

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-header__container">
            <div className="page-header__left">
              <h1 className="page-header__title">LoudML</h1>
            </div>
          </div>
        </div>
        <FancyScrollbar className="page-contents">
          {models ? (
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="panel">
                    <div className="panel-heading">
                      <h2 className="panel-title">{title}</h2>
                      <div className="loudml-page--actions">
                        <Link
                          to={`/sources/${source.id}/loudml/models/new`}
                          className="btn btn-sm btn-primary"
                        >
                          <span className="icon plus" /> Create Model
                        </Link>
                      </div>
                    </div>
                    <div className="panel-body">
                      {this.renderModelsTable()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="page-spinner" />
          )}
        </FancyScrollbar>
      </div>
    )
  }
}

const {arrayOf, func, shape, string} = PropTypes

LoudMLPage.propTypes = {
  source: shape({
    id: string.isRequired,
    links: shape({
      users: string.isRequired,
    }),
  }).isRequired,
  models: arrayOf(shape()),
  loadModels: func.isRequired,
  removeAndLoadModels: func.isRequired,
  notify: func.isRequired,
}

const mapStateToProps = state => {
  return {
    models: state.loudml.models,
  }
}

const mapDispatchToProps = dispatch => ({
  removeAndLoadModels: bindActionCreators(removeAndLoadModels, dispatch),
  loadModels: bindActionCreators(loadModelsAsync, dispatch),
  notify: bindActionCreators(notifyAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoudMLPage)
