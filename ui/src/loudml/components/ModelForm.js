import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {connect} from 'react-redux'
import {getDatasources} from 'src/loudml/apis'
import Dropdown from 'shared/components/Dropdown'
// import _ from 'lodash'

const {bool, func, shape, string} = PropTypes

class DatasourceSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datasources: null,
      error: false,
    }
  }

  componentDidMount() {
    getDatasources()
      .then(res => {
        const state = {datasources: []}

        res.data.forEach(datasource => {
          if (datasource.type === 'influxdb') {
            state.datasources.push({text: datasource.name})
          }
        })

        if (state.datasources.length === 1) {
          state.datasource = state.datasources[0].text
        }
        this.setState(state)
      })
      .catch(() => this.setState({error: true}))
  }

  onChoose = e => {
    this.props.onChoose(e.text)
  }

  render() {
    const {datasource} = this.props
    const {datasources, error} = this.state

    if (error) {
      return <p>Error! Could not get data source list</p>
    }
    if (datasources === null) {
      return <p>Retrieving data source list...</p>
    }
    return (
      <Dropdown
        name="default_datasource"
        items={datasources}
        onChoose={this.onChoose}
        selected={datasource || ''}
        className="dropdown-stretch"
      />
    )
  }
}

DatasourceSelector.propTypes = {
  datasource: string,
  onChoose: func,
}

class ModelForm extends Component {
  constructor(props) {
    super(props)
  }

  onInputChange = e => {
    const {onEdit} = this.props
    const {name, type, value} = e.target

    onEdit(name, type === 'number' ? Number(value) : value)
  }

  onDatasourceChange = value => {
    const {onEdit} = this.props
    onEdit('default_datasource', value)
  }

  render() {
    const {editMode, model, onSubmit} = this.props

    return (
      <div className="panel-body">
        <form onSubmit={onSubmit}>
          <div className="form-group col-xs-12 col-sm-6">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              placeholder="Name this model"
              onChange={this.onInputChange}
              value={model.name}
              required={true}
            />
          </div>

          <div className="form-group col-xs-12 col-sm-6">
            <label htmlFor="default_datasource">Datasource</label>
            <DatasourceSelector
              datasource={model.default_datasource}
              onChoose={this.onDatasourceChange}
            />
          </div>

          <div className="form-group col-xs-12">
            <label htmlFor="max_evals">Max iterations</label>
            <input
              type="number"
              name="max_evals"
              className="form-control input-md form-malachite"
              value={model.max_evals}
              onChange={this.onInputChange}
              placeholder="ex: 100"
            />
          </div>

          <div className="form-group col-xs-12 col-sm-6">
            <label htmlFor="bucket_interval">Bucket interval</label>
            <input
              type="text"
              name="bucket_interval"
              className="form-control input-md form-malachite"
              value={model.bucket_interval}
              onChange={this.onInputChange}
              placeholder="ex: 30s, 20m, 1h, 1d, ..."
            />
          </div>

          <div className="form-group col-xs-12 col-sm-6">
            <label htmlFor="span">Span</label>
            <input
              type="number"
              name="span"
              className="form-control input-md form-malachite"
              value={model.span}
              onChange={this.onInputChange}
              placeholder="ex: 5"
            />
          </div>

          <div className="form-group col-xs-12">
            <h4>Prediction parameters</h4>
          </div>

          <div className="form-group col-xs-12 col-sm-6">
            <label htmlFor="span">Interval</label>
            <input
              type="text"
              name="interval"
              className="form-control input-md form-malachite"
              value={model.interval}
              onChange={this.onInputChange}
              placeholder="ex: 30s, 5m, 1h, 1d, ..."
            />
          </div>

          <div className="form-group col-xs-12 col-sm-6">
            <label htmlFor="offset">Offset</label>
            <input
              type="text"
              name="offset"
              className="form-control input-md form-malachite"
              value={model.offset}
              onChange={this.onInputChange}
              placeholder="ex: 5s, 1m, 1h, 1d, ..."
            />
          </div>

          <div className="form-group form-group-submit text-center col-xs-12 col-sm-6 col-sm-offset-3">
            <button
              className={classnames('btn btn-block', {
                'btn-primary': editMode,
                'btn-success': !editMode,
              })}
              type="submit"
            >
              <span className={`icon ${editMode ? 'checkmark' : 'plus'}`} />
              {editMode ? 'Save Changes' : 'Add Model'}
            </button>

            <br />
          </div>
        </form>
      </div>
    )
  }
}

ModelForm.propTypes = {
  model: shape({
    name: string.isRequired,
  }).isRequired,
  editMode: bool.isRequired,
  onEdit: func.isRequired,
  onSubmit: func.isRequired,
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(ModelForm)
