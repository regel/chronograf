import React, {PropTypes, Component} from 'react'

import NameSection from 'src/loudml/components/NameSection'
import ModelHeader from 'src/loudml/components/ModelHeader'
import {getDatasources} from 'src/loudml/apis'
import FancyScrollbar from 'shared/components/FancyScrollbar'
import Dropdown from 'shared/components/Dropdown'

import {createModel, updateModel, train, start} from 'src/loudml/apis'

const {arrayOf, func, shape, string} = PropTypes

class TrainSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      from: 'now-1w',
      to: 'now',
    }
  }

  handleEdit = () => {
    return e => {
      this.setState({[e.target.name]: e.target.value})
    }
  }

  train = () => {
    return () => {
      const {from, to} = this.state
      this.props.train(from, to)
    }
  }

  render() {
    return (
      <div className="model-section">
        <h3 className="model-section--heading">Training</h3>
        <div className="model-section--body">
          <div className="model-section--row">
            <div className="form-group" style={{display: 'inline'}}>
              <label htmlFor="from">From</label>
              <input
                type="text"
                name="from"
                style={{width: '20%'}}
                className="form-control input-md form-malachite"
                defaultValue="now-1w"
                onChange={this.handleEdit()}
                placeholder="ex: now-5d, now-3w, ..."
              />
            </div>
            <div className="form-group" style={{display: 'inline'}}>
              <label htmlFor="to">To</label>
              <input
                type="text"
                name="to"
                style={{width: '20%'}}
                className="form-control input-md form-malachite"
                defaultValue="now"
                onChange={this.handleEdit()}
                placeholder="ex: now-5d, now-3w, ..."
              />
            </div>
            <div
              className="form-group"
              style={{display: 'inline', padding: '5px'}}
            >
              <button
                className="btn btn-sm btn-primary"
                onClick={this.train()}
                style={{width: '20%'}}
              >
                Start training
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TrainSection.propTypes = {
  modelName: string.isRequired,
  train: func.isRequired,
}

class StartSection extends Component {
  render() {
    return (
      <div className="model-section">
        <h3 className="model-section--heading">Prediction job</h3>
        <div className="model-section--body">
          <div className="model-section--row">
            <button
              className="btn btn-sm btn-primary"
              onClick={this.props.start}
            >
              Start prediction job
            </button>
          </div>
        </div>
      </div>
    )
  }
}

StartSection.propTypes = {
  start: func.isRequired,
}

class Feature extends Component {
  deleteFeature = () => this.props.deleteFeature(this.props.feature)

  handleEdit = feature => {
    return e => {
      this.props.onEdit(feature, {[e.target.name]: e.target.value})
    }
  }

  handleEditNumber = feature => {
    return e => {
      const value = e.target.value === '' ? null : parseInt(e.target.value, 10)
      this.props.onEdit(feature, {[e.target.name]: value})
    }
  }

  onMetricChoose = feature => {
    return e => {
      this.props.onEdit(feature, {metric: e.text})
    }
  }

  render() {
    const {feature} = this.props
    const metrics = ['avg', 'count', 'med', 'sum', 'min', 'max']
    return (
      <tr>
        <td>
          <input
            type="text"
            name="name"
            className="form-control input-md form-malachite"
            defaultValue={feature.name}
            onChange={this.handleEdit(feature)}
            placeholder="ex: myfeature"
            style={{width: '100px'}}
          />
        </td>
        <td>
          <input
            type="text"
            name="measurement"
            className="form-control input-md form-malachite"
            defaultValue={feature.measurement}
            onChange={this.handleEdit(feature)}
            placeholder="measurement"
            style={{width: '100px'}}
          />
        </td>
        <td>
          <input
            type="text"
            name="field"
            className="form-control input-md form-malachite"
            defaultValue={feature.field}
            onChange={this.handleEdit(feature)}
            placeholder="field"
            style={{width: '100px'}}
          />
        </td>
        <td>
          <Dropdown
            name="metric"
            onChoose={this.onMetricChoose(feature)}
            items={metrics.map(m => ({text: m}))}
            selected={feature.metric || 'avg'}
            className="dropdown-stretch"
            style={{width: '100px'}}
          />
        </td>
        <td>
          <input
            type="number"
            className="form-control input-md form-malachite"
            name="default"
            defaultValue={feature.default}
            onChange={this.handleEditNumber(feature)}
            placeholder="ex: 0"
            style={{width: '100px'}}
          />
        </td>
        <td>
          <button
            className="btn btn-sm btn-danger"
            onClick={this.deleteFeature}
          >
            <span className="icon trash" />
          </button>
        </td>
      </tr>
    )
  }
}

Feature.propTypes = {
  feature: shape({}).isRequired,
  deleteFeature: func.isRequired,
  onEdit: func.isRequired,
}

const FeaturesTable = ({features, deleteFeature, onEdit}) =>
  <table className="table v-center table-highlight">
    <thead>
      <tr>
        <th>Name</th>
        <th>Measurement</th>
        <th>Field</th>
        <th>Metric</th>
        <th>Default value</th>
      </tr>
    </thead>
    <tbody>
      {features.map((feature, i) =>
        <Feature
          key={i}
          feature={feature}
          deleteFeature={deleteFeature}
          onEdit={onEdit}
        />
      )}
    </tbody>
  </table>

FeaturesTable.propTypes = {
  features: arrayOf(shape({}).isRequired),
  deleteFeature: func,
  onEdit: func.isRequired,
}

class FeaturesSection extends Component {
  constructor(props) {
    super(props)
    this.state = {features: props.features || []}
  }

  addFeature = () => {
    const {features} = this.state
    features.push({})
    this.setState({features})
  }

  deleteFeature = toDelete => {
    let {features} = this.state

    features = features.filter(feature => feature.name !== toDelete.name)
    this.setState({features})
  }

  onEdit = (feature, val) => {
    Object.assign(feature, val)
    this.forceUpdate()
  }

  render() {
    const {features} = this.state

    return (
      <div className="model-section">
        <h3 className="model-section--heading">Features</h3>
        <div className="model-section--body">
          <div className="model-section--row">
            <div className="panel panel-solid">
              <button
                className="btn btn-sm btn-primary"
                onClick={this.addFeature}
              >
                <span className="icon plus" /> Add feature
              </button>
            </div>
            <div className="panel panel-body">
              {features.length > 0
                ? <FeaturesTable
                    features={features}
                    deleteFeature={this.deleteFeature}
                    onEdit={this.onEdit}
                  />
                : <i>No feature</i>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FeaturesSection.propTypes = {
  features: arrayOf(shape({})),
}

class DatasourceSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datasource: null,
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

  onChoose() {}

  renderDatasourceList() {
    const {datasource, datasources, error} = this.state

    if (error) {
      return <p>Error! Could not get data source list</p>
    }
    if (datasources === null) {
      return <p>Retrieving data source list...</p>
    }
    return (
      <Dropdown
        items={datasources}
        onChoose={this.onChoose}
        selected={datasource}
        className="dropdown-stretch"
      />
    )
  }

  render() {
    return (
      <div className="model-section">
        <h3 className="model-section--heading">Data source</h3>
        <div className="model-section--body">
          <div className="model-section--row">
            {this.renderDatasourceList()}
          </div>
        </div>
      </div>
    )
  }
}

const ModelParamsSection = ({model, onEdit}) =>
  <div className="model-section">
    <h3 className="model-section--heading">Model parameters</h3>
    <div className="model-section--body">
      <div className="model-section--row">
        <p>Max iterations</p>
        <input
          type="text"
          name="max_evals"
          className="form-control input-md form-malachite"
          value={model.max_evals}
          onChange={onEdit}
          placeholder="ex: 100"
        />
      </div>
      <div className="model-section--row">
        <p>Bucket interval</p>
        <input
          type="text"
          name="bucket_interval"
          className="form-control input-md form-malachite"
          value={model.bucket_interval}
          onChange={onEdit}
          placeholder="ex: 30s, 20m, 1h, 1d, ..."
        />
      </div>
      <div className="model-section--row">
        <p>Span</p>
        <input
          type="number"
          name="span"
          className="form-control input-md form-malachite"
          value={model.span}
          onChange={onEdit}
          placeholder="ex: 5"
        />
      </div>
    </div>
  </div>

ModelParamsSection.propTypes = {
  model: shape({}),
  onEdit: func.isRequired,
}

const PredictParamsSection = ({model, onEdit}) =>
  <div className="model-section">
    <h3 className="model-section--heading">Prediction parameters</h3>
    <div className="model-section--body">
      <div className="model-section--row">
        <p>Interval</p>
        <input
          type="text"
          name="interval"
          className="form-control input-md form-malachite"
          value={model.interval}
          onChange={onEdit}
          placeholder="ex: 30s, 1m, 1h, 1d, ..."
        />
      </div>
      <div className="model-section--row">
        <p>Offset</p>
        <input
          type="text"
          name="offset"
          className="form-control input-md form-malachite"
          value={model.offset}
          onChange={onEdit}
          placeholder="ex: 5s, 1m, 1h, ..."
        />
      </div>
    </div>
  </div>

PredictParamsSection.propTypes = {
  model: shape({}),
  onEdit: func.isRequired,
}

class Model extends Component {
  constructor(props) {
    super(props)
    this.defaults = {
      max_evals: 100,
      bucket_interval: '20m',
      span: 5,
      features: [],
      interval: '1m',
      offset: '10s',
      default_datasource: 'influx',
    }
    this.features = null
    this.state = {
      model: Object.assign({}, this.defaults, props.model),
    }
  }

  train = () => {
    return (from, to) => {
      const {modelName, addFlashMessage} = this.props

      train(modelName, from, to)
        .then(() => {
          addFlashMessage({type: 'success', text: 'Training started'})
        })
        .catch(error => {
          addFlashMessage({
            type: 'error',
            text: error.data || 'Could not start model training',
          })
        })
    }
  }

  start = () => {
    return () => {
      const {modelName, addFlashMessage} = this.props

      start(modelName)
        .then(() => {
          addFlashMessage({type: 'success', text: 'Prediction job started'})
        })
        .catch(error => {
          addFlashMessage({
            type: 'error',
            text: error.data || 'Could not start prediction job',
          })
        })
    }
  }

  onEdit = model => {
    return e => {
      model = Object.assign({}, this.defaults, model, {
        [e.target.name]: e.target.value,
      })
      this.setState({model})
    }
  }

  getData() {
    return Object.assign({}, this.state.model, {
      type: 'timeseries',
      features: this.features.state.features,
    })
  }

  handleCreate = () => {
    const {addFlashMessage, router, source} = this.props
    const model = this.getData()

    createModel(model)
      .then(() => {
        router.push(`/sources/${source.id}/loudml`)
        addFlashMessage({type: 'success', text: 'Model successfully created'})
      })
      .catch(error => {
        addFlashMessage({
          type: 'error',
          text: error.data || 'There was a problem creating the model',
        })
      })
  }

  validationError() {
    return null
  }

  handleUpdate = () => {
    const {addFlashMessage} = this.props
    const model = this.getData()

    updateModel(model)
      .then(() => {
        addFlashMessage({
          type: 'success',
          text: `${model.name} successfully saved!`,
        })
      })
      .catch(e => {
        addFlashMessage({
          type: 'error',
          text: `There was a problem saving ${model.name}: ${e.data}`,
        })
      })
  }

  handleSave = () => {
    const {modelName} = this.props
    if (modelName) {
      this.handleUpdate()
    } else {
      this.handleCreate()
    }
  }

  render() {
    const {source, modelName} = this.props
    const {model} = this.state

    return (
      <div className="page">
        <ModelHeader
          source={source}
          onSave={this.handleSave}
          validationError={this.validationError()}
        />
        <FancyScrollbar className="page-contents fancy-scroll--kapacitor">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="model-builder">
                  <NameSection
                    modelName={modelName}
                    onEdit={this.onEdit(model)}
                  />
                  {modelName &&
                    <TrainSection modelName={modelName} train={this.train()} />}
                  {modelName && <StartSection start={this.start()} />}
                  <DatasourceSection datasource={model.default_datasource} />
                  <ModelParamsSection
                    model={model}
                    onEdit={this.onEdit(model)}
                  />
                  <FeaturesSection
                    ref={ref => (this.features = ref)}
                    features={model.features}
                  />
                  <PredictParamsSection
                    model={model}
                    onEdit={this.onEdit(model)}
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

Model.propTypes = {
  source: shape({}).isRequired,
  router: shape({}).isRequired,
  model: shape({
    values: shape({}),
  }).isRequired,
  addFlashMessage: func.isRequired,
  modelName: string,
}

export default Model
