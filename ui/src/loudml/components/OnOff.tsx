import React, {Component} from 'react'
import classnames from 'classnames'

import uuid from 'uuid'

import {ErrorHandling} from 'src/shared/decorators/errors'

interface Props {
    value?: boolean
    fixedLabel?: string
    onSetValue: (value: boolean) => void
}

interface State {
    value: boolean
}

@ErrorHandling
export default class OnOff extends Component<Props, State> {
    public static defaultProps: Partial<Props> = {
        value: false,
    }

    private id: string

    constructor(props) {
        super(props)

        const {value} = props

        this.state = {
            value,
        }

        this.id = uuid.v4()
    }

    get label() {
        const {fixedLabel} = this.props
        const {value} = this.state

        if (fixedLabel) {
            return fixedLabel
        }

        return (value?'on':'off')
    }

    public render() {
        const {value} = this.state

        return (
            <div
                className={classnames('opt-in', {
                    'right-toggled': !value,
                })}
                >
                <div
                    className="opt-in--container on--off"
                    id={this.id}
                    >
                    <div
                        className="opt-in--groove-knob"
                        id={this.id}
                        onClick={this.handleClickToggle}
                        >
                        <div className="opt-in--gradient" />
                    </div>
                    <div className="opt-in--label on--off">
                        {this.label}
                    </div>
                </div>
            </div>
        )
    }

    private handleClickToggle = (): void => {
        const value = !this.state.value
        this.setState({value}, this.setValue)
    }

    private setValue = (): void => {
        const {onSetValue} = this.props
        const {value} = this.state

        onSetValue(value)
    }

}
