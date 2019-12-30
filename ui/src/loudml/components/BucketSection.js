import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dropdown from 'shared/components/Dropdown'

class BucketSection extends Component {
    constructor(props) {
        super(props)

    }

    handleOnChoose = item => {
        this.props.onChoose(this.props.name, item.text)
    }

    render() {
        const {
            bucket,
            buckets,
            buttonSize,
            disabled,
            name,        
        } = this.props

        if (!buckets) {
            return <p>No buckets</p>
        }

        return (
            <Dropdown
                name={name}
                items={buckets.map(ds => ({text: ds.name}))}
                onChoose={this.handleOnChoose}
                selected={bucket || ''}
                className="dropdown-stretch"
                buttonSize={buttonSize}
                disabled={disabled}
            />
        )
    }
}

BucketSection.defaultProps = {
    buckets: [],
}

const {func, string, arrayOf, shape, bool} = PropTypes

BucketSection.propTypes = {
    name: string.isRequired,
    bucket: string,
    buckets: arrayOf(shape()),
    onChoose: func.isRequired,
    buttonSize: string,
    disabled: bool,
}

export default BucketSection
