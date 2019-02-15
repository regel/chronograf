import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dropdown from 'shared/components/Dropdown'

class ModelTypeSection extends Component {
    constructor(props) {
        super(props)

        const type = props.modelTypes.find(m => (m.default))
        this.state = {
            defaultType: (type&&type.type)||null
        }
    }

    render() {
        const {
            modelTypes,
            buttonSize,
            disabled,
            name,        
        } = this.props

        if (!modelTypes) {
            return <p>No models</p>
        }

        return (
            <Dropdown
                name={name}
                items={modelTypes.map(m => ({text: m.name}))}
                onChoose={this.handleOnChoose}
                selected={this.safeValue}
                className="dropdown-stretch"
                buttonSize={buttonSize}
                disabled={disabled}
            />
        )
    }

    handleOnChoose = item => {
        const {defaultType} = this.state
        const type = this.props.modelTypes.find(m => m.name === item.text)
        this.props.onChoose(this.props.name, (type&&type.type)||defaultType)
    }

    get safeValue() {
        const item = this.props.modelTypes.find(m => m.type === this.props.type)
        if (item) {
            return item.name
        }
        return ''
    }    

}

ModelTypeSection.defaultProps = {
    modelTypes: [],
}

const {func, string, arrayOf, shape, bool} = PropTypes

ModelTypeSection.propTypes = {
    name: string.isRequired,
    type: string,
    modelTypes: arrayOf(shape()),
    onChoose: func.isRequired,
    buttonSize: string,
    disabled: bool,
}

export default ModelTypeSection
