import React, {Component} from 'react'
import {InjectedRouter} from 'react-router'
import {connect} from 'react-redux'

import {bindActionCreators} from 'redux'
import {notify as notifyAction} from 'src/shared/actions/notifications'

import {ErrorHandling} from 'src/shared/decorators/errors'

import { TemplateModel } from 'src/loudml/types/template';

import {
  Source,
  Notification,
  QueryConfig,
} from 'src/types'
import ModelTemplate from 'src/loudml/components/ModelTemplate';
import { getDatasources, createModelFromTemplate, trainAndStartModel } from 'src/loudml/apis';
import { notifyModelCreationFailed, notifyModelCreated, notifyModelTraining, notifyModelTrainingFailed } from 'src/loudml/actions/notifications';
import { parseError } from 'src/loudml/utils/error';
import { convertTimeRange } from 'src/loudml/utils/timerange';
import {
  modelCreated as modelCreatedAction,
  jobStart as jobStartAction
} from 'src/loudml/actions/view';

import {
  LoudMLActions,
} from 'src/loudml/types/actions'
import { errorThrown } from 'src/shared/actions/errors';

interface Props {
  source: Source
  notify: (notification: Notification) => void
  router: InjectedRouter
  queryConfig: QueryConfig
  modelActions: LoudMLActions
}

interface State {
  datasource: string
  db: string
  measurement: string
  tagKey: string
  // timeRange: TimeRange
  template: TemplateModel
}

const DEFAULT_TEMPLATE: TemplateModel = {
  name: 'AutoML',
  trigger: 'syslog',
  hosts: [],
}

@ErrorHandling
class ModelTemplatePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      datasource: null,
      db: 'telegraf',
      measurement: 'syslog',
      tagKey: 'host',
      // timeRange: timeRanges.find(tr => tr.lower === 'now() - 15m'),
      template: {...DEFAULT_TEMPLATE},
    }
  }

  public render() {
    const {
      source,
    } = this.props
    const {
      db,
      measurement,
      tagKey,
      template,
    } = this.state

    return (
      <ModelTemplate
        source={source}
        db={db}
        measurement={measurement}
        tagKey={tagKey}
        template={template}
        updateModelName={this.updateModelName}
        onChooseTrigger={this.chooseTrigger}
        updateTagsValues={this.updateTagsValues}
        handleSave={this.handleSave}
      />
    )
  }

  public componentDidMount() {
    this.getDatasource()
  }

  public componentDidUpdate(prevProps) {
    if (this.props.queryConfig.database !== prevProps.queryConfig.database) {
        this.getDatasource();
    }
  }

  private getDatasource = async () => {
    const {db} = this.state
    const {data} = await getDatasources()
    const datasource = data.find(d => d.database === db)
    this.setState({datasource: datasource&&datasource.name})
  }

  private createAndTrainModel = async (template, name, host) => {
    const {
        // modelActions: {modelCreated},
        notify,
    } = this.props

    try {
        await createModelFromTemplate(template, {name, host})
        // modelCreated(model)
        notify(notifyModelCreated(name))
        this.trainModel(name)
    } catch (error) {
        console.error(error)
        notify(notifyModelCreationFailed(name, parseError(error)))
    }
  }

  private trainModel = async (name) => {
    const {
        modelActions: {jobStart},
        notify,
    } = this.props
    const {
        lower,
        upper
    } = convertTimeRange({
      lower: 'now() - 7d',
      upper: null,
    })
    
    try {
        const res = await trainAndStartModel(name, lower, upper)
        const job = {
            name,
            id: res.data,
            type: 'training',
            state: 'waiting'
        }

        jobStart(job)
        notify(notifyModelTraining(job))
    } catch (error) {
        console.error(error)
        notify(notifyModelTrainingFailed(name, parseError(error)))
    }
  }


  private updateModelName = (name: string) => {
    const {template} = this.state

    this.setState({
      template: {
        ...template,
        name,
      }
    })
  }

  private chooseTrigger = (name: string) => {
    const {template} = this.state

    this.setState({
      template: {
        ...template,
        name,
      }
    })
  }

  private updateTagsValues = (tags: string[]) => {
    const {template} = this.state

    this.setState({
      template: {
        ...template,
        hosts: [...tags],
      },
    })
  }

  private handleSave = () => {
    const {source: {id}, router} = this.props
    const {template, db} = this.state

    Promise.all(
      template.hosts.map(
          host => {
            const name = `${template.name}_5m_${host.replace(/[\.-]/g, '_')}`
            return this.createAndTrainModel(`${db}_${template.trigger}`, name, host)
          }
      )
    )
    .then(_ => {
        router.push(`/sources/${id}/loudml`)
    })
    .catch(error => {
        errorThrown(error)
    })    
  }
}

const mapStateToProps = ({dataExplorerQueryConfigs, dataExplorer: {queryIDs}}) => {
  const queryConfig = (queryIDs.length>0
      ? dataExplorerQueryConfigs[queryIDs[0]]
      : null)

  return {
      queryConfig,
  }
}

const mapDispatchToProps = dispatch => ({
  modelActions: {
    modelCreated: model => dispatch(modelCreatedAction(model)),
    jobStart: job => dispatch(jobStartAction(job)),
  },
  notify: bindActionCreators(notifyAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelTemplatePage)
