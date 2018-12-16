import React, {Component, ChangeEvent, KeyboardEvent} from 'react'

import {ErrorHandling} from 'src/shared/decorators/errors'

interface Props {
  defaultName: string
  onModelRename: (name: string) => void
}

interface State {
  reset: boolean
}

@ErrorHandling
class TemplateNameSection extends Component<Props, State> {
  private inputRef: HTMLInputElement

  constructor(props: Props) {
    super(props)

    this.state = {
      reset: false,
    }
  }

  public handleInputBlur = (reset: boolean) => (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const {defaultName, onModelRename} = this.props

    let modelName: string
    if (reset) {
      modelName = defaultName
    } else {
      modelName = e.target.value
    }
    onModelRename(modelName)
    this.setState({reset: false})
  }

  public handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.inputRef.blur()
    }
    if (e.key === 'Escape') {
      this.inputRef.value = this.props.defaultName
      this.setState({reset: true}, () => this.inputRef.blur())
    }
  }

  public render() {
    const {defaultName} = this.props
    const {reset} = this.state

    return (
      <div className="rule-section">
        <h3 className="rule-section--heading">{this.header}</h3>
        <div className="rule-section--body">
          <div className="rule-section--row rule-section--row-first rule-section--row-last">
            <input
              type="text"
              className="form-control input-md form-malachite"
              defaultValue={defaultName}
              onBlur={this.handleInputBlur(reset)}
              onKeyDown={this.handleKeyDown}
              placeholder="ex: telegraf_syslog"
              ref={r => (this.inputRef = r)}
            />
          </div>
        </div>
      </div>
    )
  }

  private get header() {
    return 'Prefix your Model Name'
  }
}

export default TemplateNameSection
