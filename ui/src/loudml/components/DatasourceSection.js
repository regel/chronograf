import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dropdown from 'shared/components/Dropdown'

class DatasourceSection extends Component {
    constructor(props) {
        super(props)

    }

    handleOnChoose = item => {
        this.props.onChoose(this.props.name, item.text)
    }

    render() {
        const {
            datasource,
            datasources,
            buttonSize,
            disabled,
            name,        
        } = this.props

        if (!datasources) {
            return <p>No datasources</p>
        }

        return (
            <Dropdown
                name={name}
                items={datasources.map(ds => ({text: ds.name}))}
                onChoose={this.handleOnChoose}
                selected={datasource || ''}
                className="dropdown-stretch"
                buttonSize={buttonSize}
                disabled={disabled}
            />
        )
    }
}

DatasourceSection.defaultProps = {
    datasources: [],
}

const {func, string, arrayOf, shape, bool} = PropTypes

DatasourceSection.propTypes = {
    name: string.isRequired,
    datasource: string,
    datasources: arrayOf(shape()),
    onChoose: func.isRequired,
    buttonSize: string,
    disabled: bool,
}

export default DatasourceSection
