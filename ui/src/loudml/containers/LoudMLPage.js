import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import moment from 'moment'
import _ from 'lodash'

import {errorThrown as errorThrownAction} from 'shared/actions/errors'
import {notify as notifyAction} from 'shared/actions/notifications'
import SourceIndicator from 'shared/components/SourceIndicator'
import FancyScrollbar from 'shared/components/FancyScrollbar'

import ModelsTable from 'src/loudml/components/ModelsTable'

import {
    getDashboards,
    createDashboard,
    addDashboardCell,
    updateDashboardCell,
} from 'src/dashboards/apis'
import {createQueryFromModel} from 'src/loudml/utils/query'
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
import {
    DEFAULT_CONFIDENT_DASHBOARD,
    DEFAULT_CONFIDENT_CELL
} from 'src/loudml/constants/dashboard';

class LoudMLPage extends Component {
    constructor(props) {
        super(props)

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
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
        clearInterval(this.fetchModelsID)
        this.fetchModelsID = false
        clearInterval(this.jobStatusID)
        this.jobStatusID = false
        clearInterval(this.jobFetchID)
        this.jobFetchID = false
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
            notify(notifyErrorGettingModels(this._parseError(error)))
        })
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
            errorThrown,
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
                notify(notifyModelDeleted(name))
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
                notify(notifyErrorCallback(name, this._parseError(error)))
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

    forecastModel = (name, from, to) => {
        const {fromT, toT} = this._convertTime(from, to)
        this.startJob(
            name,
            api.forecastModel(name, fromT, toT),
            'forecast',
            notifyModelForecasting,
            notifyModelForecastingFailed,
        )
    }

    startModel = name => () => {
        const {notify} = this.props

        api.startModel(name)
            .then(() => {
                notify(notifyModelStarting(name))
            })
            .catch(error => {
                notify(notifyModelStartingFailed({name}, this._parseError(error)))
            })
    }

    stopModel = name => () => {
        const {notify} = this.props

        api.stopModel(name)
            .then(() => {
                notify(notifyModelStopped(name))
            })
            .catch(error => {
                notify(notifyModelStoppedFailed(name, this._parseError(error)))
            })
    }

    stopJob = (name, id) => {
        const {
            notify,
            modelActions: {jobStop},
            jobs,
        } = this.props

        const job = jobs.find(i => i.id === id)

        api.stopJob(id)
            .then(() => {
                jobStop(job)
                notify(notifyJobStopped(name))
            })
            .catch(error => {
                notify(notifyJobStoppedFailed(name, this._parseError(error)))
            })
    }

    stopTrain = name => () => {
        const {models} = this.props

        // get job
        const id = models
            .find(model => model.settings.name === name)
            .training
            .job_id
        this.stopJob(name, id)
    }

    stopForecast = name => () => {
        const {jobs} = this.props

        // get job
        const id = jobs
            .find(job => job.name === name && job.type === 'forecast')
            .id
        this.stopJob(name, id)
    }

    createOrUpdateConfident = (dashboard, model) => {
        const {source: {links: {self}}} = this.props
        const {settings: {name}} = model
        const cellName = `${name} prediction`
        // const sourceName = `/chronograf/v1/sources/${id}`
        const queries = createQueryFromModel(model)

        let cell
        if (dashboard===undefined) {
            // create
            dashboard = {
                ...DEFAULT_CONFIDENT_DASHBOARD,
                name,
                cells: [
                    {
                        ...DEFAULT_CONFIDENT_CELL,
                        name: cellName,
                        queries,
                        source: self,
                    }
                ]
            }
            return createDashboard(dashboard)
        }
        cell = dashboard.cells.find(item => item.name === cellName)
        if (cell===undefined) {
            cell = {
                ...DEFAULT_CONFIDENT_CELL,
                name: cellName,
                queries,
                source: self,
            }
            return addDashboardCell(dashboard, cell)
        }
        return updateDashboardCell({
            ...cell,
            queries,
            source: self,
        })
    }

    selectModelGraph = async (model, graph) => {
        const {errorThrown} = this.props
        const {settings: {name}} = model

        console.log(name, 'select graph', graph)
        try {
            const {data: {dashboards}} = await getDashboards()
            const dashboard = dashboards.find(item => item.name === name)
            console.log('dashboard found', dashboard)
            await this.createOrUpdateConfident(dashboard, model)
        } catch (error) {
            console.error(error)
            errorThrown(error)
        }
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
                                    onStart={this.startModel}
                                    onStop={this.stopModel}
                                    onTrain={this.trainModel}
                                    onStopTrain={this.stopTrain}
                                    onForecast={this.forecastModel}
                                    onStopForecast={this.stopForecast}
                                    onSelectModelGraph={this.selectModelGraph}
                                />
                            </div>
                        </div>
                    </div>
                </FancyScrollbar>
            </div>
        )
    }
}

const {arrayOf, func, shape, bool} = PropTypes

LoudMLPage.propTypes = {
    source: shape({}),
    models: arrayOf(shape()).isRequired,
    isFetching: bool.isRequired,
    jobs: arrayOf(shape()).isRequired,
    modelActions: shape({
        modelsLoaded: func.isRequired,
        modelDeleted: func.isRequired,
        jobStart: func.isRequired,
        jobStop: func.isRequired,
        jobsUpdate: func.isRequired,
    }).isRequired,
    notify: func.isRequired,
    errorThrown: func.isRequired,
}

function mapStateToProps(state) {
    const { isFetching, models } = state.loudml.models
    const { jobs } = state.loudml.jobs

    models.sort((a, b) => a.settings.name > b.settings.name)

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
