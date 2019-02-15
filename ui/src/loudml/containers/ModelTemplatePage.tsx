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
import { createModelFromTemplate, trainAndStartModel } from 'src/loudml/apis';
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
  db: string
  measurement: string
  tagKey: string
  // timeRange: TimeRange
  template: TemplateModel
}

const DEFAULT_TEMPLATE: TemplateModel = {
  modelPrefix: 'AutoML',
  name: null,
  hosts: [],
}

@ErrorHandling
class ModelTemplatePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      db: null,
      measurement: null,
      tagKey: null,
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
        onChooseTemplate={this.chooseTemplate}
        updateTagsValues={this.updateTagsValues}
        handleSave={this.handleSave}
        validationError={this.validationError}
      />
    )
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
      lower: 'now() - 11d',
      upper: 'now() - 4d',
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


  private updateModelName = (modelPrefix: string) => {
    const {template} = this.state

    this.setState({
      template: {
        ...template,
        modelPrefix,
      }
    })
  }

  private chooseTemplate = (name: string, params: string[]) => {
    const {template} = this.state

    const tag = params.find(p => (p!=='name'))
    const dbMeasurement = name.split('_')

    this.setState({
      db: dbMeasurement[0],
      measurement: dbMeasurement[1],
      tagKey: tag,
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

  private handleSave = async () => {
    const {source: {id}, router} = this.props
    const {template} = this.state

    Promise.all(
      template.hosts.map(
          host => {
            const name = `${template.modelPrefix}_5m_${host.replace(/[\.-]/g, '_')}`
            return this.createAndTrainModel(template.name, name, host)
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
  
  private get validationError() {
    const {template, tagKey} = this.state
  
    if (!template.modelPrefix) {
      return 'Prefix could not be empty'
    }
    if (!template.name) {
      return 'No template selected'
    }
    if (!template.hosts.length) {
      return `No ${tagKey} values selected`
    }
  }
}

const mapDispatchToProps = dispatch => ({
  modelActions: {
    modelCreated: model => dispatch(modelCreatedAction(model)),
    jobStart: job => dispatch(jobStartAction(job)),
  },
  notify: bindActionCreators(notifyAction, dispatch),
})

export default connect(null, mapDispatchToProps)(ModelTemplatePage)
