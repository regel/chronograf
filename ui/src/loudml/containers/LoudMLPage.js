import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import _ from 'lodash'

import {errorThrown as errorThrownAction} from 'shared/actions/errors'
import {notify as notifyAction} from 'shared/actions/notifications'
import {errorThrown} from 'shared/actions/errors'
import SourceIndicator from 'shared/components/SourceIndicator'
import FancyScrollbar from 'shared/components/FancyScrollbar'

import ModelsTable from 'src/loudml/components/ModelsTable'

import * as api from 'src/loudml/apis'
import {
  modelsLoaded as modelsLoadedAction,
  modelDeleted as modelDeletedAction,
  jobStart as jobStartAction,
  jobStop as jobStopAction,
  jobsUpdate as jobsUpdateAction,
} from "src/loudml/actions/view"

import {
  notifyErrorGettingModels,
  notifyModelDeleted,
  notifyModelDeleteFailed,
  notifyModelStarting,
  notifyModelStartingFailed,
  notifyModelTraining,
  notifyModelTrainingFailed,
  notifyModelForecasting,
  notifyModelForecastingFailed,
  notifyModelStopped,
  notifyModelStoppedFailed,
  notifyJobSuccess,
  notifyJobFailed,
  notifyJobStopped,
  notifyJobStoppedFailed,
} from 'src/loudml/actions/notifications'

class LoudMLPage extends Component {
  constructor(props) {
    super(props)

  }

  _loadModels() {
    const {
      modelActions: {modelsLoaded},
      notify
    } = this.props

    this._asyncRequest = api.getModels()
      .then(res => {
        this._asyncRequest = null;
        modelsLoaded(res.data)
      })
      .catch(error => {
        notify(notifyErrorGettingModels(error))
      })
  }

  componentDidMount() {
    this._loadModels()

    this.jobFetchID = setInterval(
      () => this.fetchJobsState(),
      10000
    )
    this.jobStatusID = setInterval(
      () => this.notifyJobsState(),
      10000
    )
    this.fetchModelsID = setInterval(
      () => this._loadModels(),
      10000
    )
  }

  componentWillUnmount() {
    clearInterval(this.fetchModelsID)
    this.fetchModelsID = false
    clearInterval(this.jobFetchID)
    this.jobFetchID = false
    clearInterval(this.jobStatusID)
    this.jobStatusID = false
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  notifyJobsState() {
    const {
      jobs,
      modelActions: {jobStop},
      notify
    } = this.props

    // notify if needed
    const jobsFinished = jobs
      .filter(job => ['done', 'failed'].includes(job.state))
      jobsFinished.forEach(job => (
      job.state === 'done' ? notify(notifyJobSuccess(job)) : notify(notifyJobFailed(job))
    ))
    // update state
    jobsFinished.forEach(job => jobStop(job))
  }

  fetchJobsState() {
    const {
      jobs,
      modelActions: {jobsUpdate},
    } = this.props

    if (!jobs || !jobs.length) {
      return
    }

    Promise.all(
      jobs.map(
        job => api.getJob(job.id)
      )
    )
    .then(res => {
      const datas = res.map(v => v.data)
      jobsUpdate(datas)
    })
    .catch(error => {
      errorThrown(error)
    })
  }

  _parseError = error => {
    return _.get(error, ['data', 'message'], _.get(error, ['data'], error))
  }

  deleteModel = name => () => {
    const {
      modelActions: {modelDeleted},
      notify
    } = this.props

    api.deleteModel(name)
      .then(() => {
        modelDeleted(name)
        notify(notifyModelDeleted(`${name} deleted successfully`))
      })
      .catch(error => {
        notify(notifyModelDeleteFailed(name, error))
      })
  }

  startJob = (
    name,
    apiCallback,
    jobType,
    notifySucessCallback,
    notifyErrorCallback
  ) => {
    const {
      modelActions: {jobStart},
      notify
    } = this.props
    
    apiCallback
      .then((res) => {
        const job = {
          name,
          id: res.data,
          type: jobType,
          state: 'waiting'
        }

        jobStart(job)
        notify(notifySucessCallback(job))
      })
      .catch(error => {
        notify(notifyErrorCallback({name}, this._parseError(error)))
      })
  }

  _convertTime = (from, to) => {
    const regex = /[ \(\)]/
    return {
      fromT: moment(from.replace(regex, '')).format('X'),
      toT: moment(to.replace(regex, '')).format('X')
    }
  }

  trainModel = (name, from, to) => {
    const {fromT, toT} = this._convertTime(from, to)
    this.startJob(
      name,
      api.trainModel(name, fromT, toT),
      'training',
      notifyModelTraining,
      notifyModelTrainingFailed,
    )
  }

  forecastModel = (name, from, to) => () => {

    this.startJob(
      name,
      api.forecastModel(name, from, to),
      'forecast',
      notifyModelForecasting,
      notifyModelForecastingFailed,
    )
  }

  predictModel = name => () => {
    const {
      notify
    } = this.props

    api.startModel(name)
    .then((res) => {
      notify(notifyModelStarting(name))
    })
    .catch(error => {
      notify(notifyModelStartingFailed({name}, this._parseError(error)))
    })
  }

  stopModel = name => () => {
    const {
      notify
    } = this.props

    api.stopModel(name)
      .then(() => {
        notify(notifyModelStopped(name))
      })
      .catch(error => {
        notify(notifyModelStoppedFailed(name, this._parseError(error)))
      })
  }

  stopTrain = name => () => {
    const {
      modelActions: {jobStop},
      notify,
      // jobs,
      models,
    } = this.props

    // get job
    // const job = jobs.find(job => job.name === name)
    const id = models.find(
      model => model.settings.name === name)
      .training
      .job_id

    api.stopJob(id)
      .then(() => {
        // jobStop(job)
        notify(notifyJobStopped(name))
      })
      .catch(error => {
        notify(notifyJobStoppedFailed(name, this._parseError(error)))
      })
  }


  render() {
    const {isFetching, models, jobs, source} = this.props

    if (isFetching) {
      return <div className="page-spinner" />
    }

    return (
      <div className="page loudml-page">
        <div className="page-header">
          <div className="page-header__container">
            <div className="page-header__left">
              <h1 className="page-header__title">LoudML</h1>
            </div>
            <div className="page-header__right">
              <SourceIndicator />
            </div>
          </div>
        </div>
        <FancyScrollbar className="page-contents" style={{'margin-bottom': '300px'}}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <ModelsTable
                  source={source}
                  models={models}
                  jobs={jobs}
                  onDelete={this.deleteModel}
                  onPredict={this.predictModel}
                  onTrain={this.trainModel}
                  onForecast={this.forecastModel}
                  onStop={this.stopModel}
                  onStopTrain={this.stopTrain}
                />
              </div>
            </div>
          </div>
        </FancyScrollbar>
      </div>
    )
  }
}

LoudMLPage.propTypes = {
  source: PropTypes.shape({
    links: PropTypes.shape({
      proxy: PropTypes.string.isRequired,
      self: PropTypes.string.isRequired,
    }),
  }),
  models: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isFetching: PropTypes.bool.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  modelActions: PropTypes.shape({
    modelsLoaded: PropTypes.func.isRequired,
    modelDeleted: PropTypes.func.isRequired,
    jobStart: PropTypes.func.isRequired,
    jobStop: PropTypes.func.isRequired,
    jobsUpdate: PropTypes.func.isRequired,
  }).isRequired,
  notify: PropTypes.func.isRequired,
  errorThrown: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const { isFetching, models } = state.loudml.models
  const { jobs } = state.loudml.jobs

  return {
    models,
    isFetching,
    jobs
  }
}

const mapDispatchToProps = dispatch => ({
  modelActions: {
    modelsLoaded: models => dispatch(modelsLoadedAction(models)),
    modelDeleted: name => dispatch(modelDeletedAction(name)),
    jobStart: job => dispatch(jobStartAction(job)),
    jobStop: job => dispatch(jobStopAction(job)),
    jobsUpdate: jobs => dispatch(jobsUpdateAction(jobs)),
  },
  notify: message => dispatch(notifyAction(message)),
  errorThrown: error => dispatch(errorThrownAction(error))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoudMLPage)
