import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import {deleteModel} from 'src/loudml/apis'

class ModelsTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      models: this.props.models,
    }
  }

  deleteModel = name => {
    return () => {
      deleteModel(name).then(() => {
        let {models} = this.state

        console.error(models)
        models = models.filter(model => model.settings.name !== name)
        console.error(models)
        this.setState({models})
      })
    }
  }

  renderTable() {
    const {source} = this.props
    const {models} = this.state
    return models.length
      ? <table className="table v-center margin-bottom-zero table-highlight">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {models.map(({settings}) => {
              return (
                <tr key={settings.name}>
                  <td>
                    <Link
                      to={`/sources/${source.id}/loudml/models/edit/${settings.name}`}
                    >
                      {settings.name}
                    </Link>
                  </td>
                  <td className="text-right">
                    <a
                      className="btn btn-xs btn-danger table--show-on-row-hover"
                      href="#"
                      onClick={this.deleteModel(settings.name)}
                    >
                      <span className="icon trash" />
                      Delete model
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      : this.renderTableEmpty()
  }

  renderTableEmpty() {
    const {source: {id}} = this.props
    return (
      <div className="generic-empty-state">
        <h4 className="no-user-select">No model</h4>
        <br />
        <h6 className="no-user-select">
          <Link
            style={{marginLeft: '10px'}}
            to={`/sources/${id}/loudml/models/new`}
            className="btn btn-primary btn-sm"
          >
            Create a model
          </Link>
        </h6>
      </div>
    )
  }

  render() {
    const {source: {id}} = this.props
    return (
      <div className="panel">
        <div className="panel-heading">
          <h2 className="panel-title">
            {this.props.models.length} Models
          </h2>
          <Link
            style={{marginLeft: '10px'}}
            to={`/sources/${id}/loudml/models/new`}
            className="btn btn-primary btn-sm"
          >
            <span className="icon plus" /> Create a new model
          </Link>
        </div>
        <div className="panel-body">
          {this.renderTable()}
        </div>
      </div>
    )
  }
}

const {arrayOf, shape, string} = PropTypes

ModelsTable.propTypes = {
  models: arrayOf(
    shape({
      name: string,
    })
  ),
  source: shape({
    id: string.isRequired,
    name: string.isRequired,
  }).isRequired,
}

export default ModelsTable
