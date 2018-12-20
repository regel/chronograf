import React, {PureComponent} from 'react'
import _ from 'lodash'
import classnames from 'classnames'

import {Source, RemoteDataState} from 'src/types'
import { TemplateModel } from 'src/loudml/types/template';
import {proxy} from 'src/utils/queryUrlGenerator'
import parseShowTagValues from 'src/shared/parsing/showTagValues';

interface Props {
  template: TemplateModel
  onUpdateTags: (tags: string[]) => void
  source: Source
  db: string
  measurement: string
  tagKey: string
}

interface State {
  tagValues: string[]
  tagValuesStatus: RemoteDataState
}

class TemplateTagsSection extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      tagValues: [],
      tagValuesStatus: RemoteDataState.Loading,
    }

    this.handleChoose = this.handleChoose.bind(this)
  }

  public async componentDidMount() {
    await this.loadTagValues()
  }
  
  public async componentDidUpdate(prevProps) {
    const {source, db, measurement, tagKey} = this.props

    if (
      _.isEqual(prevProps.source, source) &&
      _.isEqual(prevProps.db, db) &&
      _.isEqual(prevProps.measurement, measurement) &&
      _.isEqual(prevProps.tagKey, tagKey)
    ) {
      return
    }

    await this.loadTagValues()
  }

  public render() {
    const {tagKey} = this.props
    
    return (
      <div className="rule-section">
        <h3 className="rule-section--heading">Select one or more values for {tagKey}</h3>
        <div className="rule-section--body">
          <div className="rule-section--row rule-section--row-first rule-section--row-last">
            {this.renderTagValues}
        </div>
      </div>
    </div>
    )
  }

  private loadTagValues = async (): Promise<void> => {
    const {
      source,
      db,
      measurement,
      tagKey,
      onUpdateTags,
    } = this.props

    this.setState({tagValuesStatus: RemoteDataState.Loading})

    try {
      const {data} = await proxy({
        source: source.links.proxy,
        db,
        query: `SHOW TAG VALUES ON "${db}" FROM "${measurement}" WITH KEY = "${tagKey}"`,
      })

      const {tags} = parseShowTagValues(data)
      const tagValues = _.get(Object.values(tags), 0, [])

      this.setState({
        tagValuesStatus: RemoteDataState.Done,
        tagValues,
      })
      onUpdateTags(tagValues)
    } catch (error) {
      this.setState({tagValuesStatus: RemoteDataState.Error})
      console.error(error)
    }
  }

  private get renderTagValues() {
    const {template: {hosts}} = this.props
    const {tagValues} = this.state
    if (!tagValues.length) {
        return (<div>no tag values</div>)
    }

    return (
        <div className="query-builder--sub-list">
            {tagValues.map(v => {
                const cx = classnames('query-builder--list-item', {
                    active: hosts.indexOf(v) > -1,
                })
                return (
                    <div
                        className={cx}
                        onClick={_.wrap(v, this.handleChoose)}
                        key={v}
                        data-test={`query-builder-list-item-tag-value-${v}`}
                    >
                        <span>
                            <div className="query-builder--checkbox" />
                            {v}
                        </span>
                    </div>
                )
            })}
        </div>
      )
  }

  private handleChoose(tagValue: string) {
    const {onUpdateTags, template: {hosts}} = this.props

    const tagIndex = hosts.indexOf(tagValue)
    const selected = [...hosts]

    if (tagIndex > -1) {  // remove
      selected.splice(tagIndex, 1)
    } else {              // add
      selected.push(tagValue)
    }
    onUpdateTags(selected)
  }

}

export default TemplateTagsSection
