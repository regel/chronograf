import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {withRouter} from 'react-router'

import {errorThrown as errorThrownAction} from 'shared/actions/errors'
import {notify as notifyAction} from 'shared/actions/notifications'
import PageHeader from 'src/reusable_ui/components/page_layout/PageHeader'
import FancyScrollbar from 'shared/components/FancyScrollbar'

import {ErrorHandling} from 'src/shared/decorators/errors'

import QuestionMark from 'src/loudml/components/QuestionMark'
import uuid from 'uuid'
import moment from 'moment'

import {parseError} from 'src/loudml/utils/error'
import * as api from 'src/loudml/apis'
import {
    modelsLoaded as modelsLoadedAction,
} from "src/loudml/actions/view"
import { LINE_COLOR_SCALES } from 'src/shared/constants/graphColorPalettes';

import {
    notifyErrorGettingModels,
} from 'src/loudml/actions/notifications'
import AnomalyExplorer from 'src/loudml/components/AnomalyExplorer'
import ColorScaleDropdown from 'src/shared/components/ColorScaleDropdown';

@ErrorHandling
class JobAnalyzePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            colors: LINE_COLOR_SCALES[0],
        }      
    }

    componentDidMount() {
        this._loadModels()

        this.fetchModelsID = setInterval(
            () => this._loadModels(),
            10000
        )

        this.setState({data: this.getData()})
    }

    componentWillUnmount() {
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
        clearInterval(this.fetchModelsID)
        this.fetchModelsID = false
    }

    _loadModels() {
        const {
            modelActions: {modelsLoaded},
            notify,
            isFetching,
        } = this.props

        if (isFetching && this._asyncRequest) {
            return
        }

        this._asyncRequest = api.getModels()
        .then(res => {
            this._asyncRequest = null;
            modelsLoaded(res.data)
        })
        .catch(error => {
            notify(notifyErrorGettingModels(parseError(error)))
        })
    }

    render() {
        const {isFetching} = this.props
        const {colors, data} = this.state

        if (isFetching) {
            return <div className="page-spinner" />
        }

        return (
            <div className="page">
                <PageHeader
                    titleText="Feature Analyze"
                    sourceIndicator={true}
                    optionsComponents={(
                        <div className="page-header--right">
                            <QuestionMark />
                            <button
                                className="btn btn-default btn-sm"
                                title="Return to Manage Tasks"
                                onClick={this.handleExit}
                                >
                                Exit
                            </button>
                        </div>)}
                    />
                <FancyScrollbar className="page-contents">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                        <div className="panel">
                            {this.renderPanelHeading}
                            <div className="panel-body">
                            Here is my body
                                <AnomalyExplorer
                                    anomalies={data}
                                    colors={colors.colors}
                                    />
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </FancyScrollbar>
            </div>
        )
    }

    get renderPanelHeading() {
        // const {source: {id}} = this.props
        const {colors} = this.state

        return (
            <div className="panel-heading">
                <h2 className="panel-title">Here is my heading</h2>
                <div className="panel-controls">
                    <div
                        className="btn btn-sm btn-default btn-square"
                        onClick={this.onManualRefresh}
                        >
                        <span className="icon refresh" />
                    </div>
                    <div className="form-group" style={{width: '300px'}}>
                        <ColorScaleDropdown
                            onChoose={this.handleUpdateLineColors}
                            stretchToFit={true}
                            selected={colors.colors}
                        />
                    </div>
                </div>
            </div>
        )
    }
    
    handleExit = () => {
        const {
          source: {id: sourceID},
          router,
        } = this.props
    
        return router.push(`/sources/${sourceID}/loudml`)
    }
    
    handleUpdateLineColors = colors => {
        this.setState({colors})
    }
        
    onManualRefresh = _ => {
        this.setState({data: this.getData()})
    }

    getData = () => {
        // const {timeRange: {
        //   lower,
        //   upper,
        // }} = this.state
        const rowFactor = 10;  // TODO replace with dropdown or input
        const rows = Math.floor(Math.random()*rowFactor)+1;
    
        const lower = moment().subtract(7, 'days')
    
        function randomDate(from, to) {
          // const range = to - from
          const start = moment(from + Math.random() * (to - from))
          const end = moment(start + Math.random() * (to - start))
          return {start, end}
        }
    
    
        const START_DATE = moment(lower)
    
        return new Array(rows).fill(null).map(_ => {
          const anomalies = Math.floor(Math.random()*3)+1
          const range = Math.floor((moment().valueOf() - START_DATE.valueOf())/anomalies)
          return {
            key: uuid.v4(),
            'anomalies': new Array(anomalies).fill(null).map((_, i) => {
              const {start, end} = randomDate(START_DATE.valueOf()+i*range, START_DATE.valueOf()+(i+1)*range)
              return {
                start_date: start.toISOString(),
                end_date: end.toISOString(),
                score: Math.random()*100,
              }
            }),
          }
        })
          // {
          //   "key": "key1",
          //   "anomalies": [
          //     {
          //       "start_date": "2018-11-20T00:00:00Z",
          //       "end_date": "2018-11-21T00:00:00Z",
          //       "score": 25,
          //     },
          //   ],
          // },
          // {
          //   "key": "key10",
          //   "anomalies": []
          // },
      }
    
}

const {arrayOf, func, shape, bool} = PropTypes

JobAnalyzePage.propTypes = {
    source: shape({}),
    router: shape({
        push: func.isRequired,
    }).isRequired,
    models: arrayOf(shape()).isRequired,
    isFetching: bool.isRequired,
    modelActions: shape({
        modelsLoaded: func.isRequired,
    }).isRequired,
    notify: func.isRequired,
    errorThrown: func.isRequired,
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
    },
    notify: message => dispatch(notifyAction(message)),
    errorThrown: error => dispatch(errorThrownAction(error))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(JobAnalyzePage)
)
