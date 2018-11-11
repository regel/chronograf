import React, { Component } from 'react'
import {PropTypes} from 'prop-types'

import CustomTimeJobButton from 'src/loudml/components/CustomTimeJobButton'

export class TrainTimeJobButton extends Component {
    constructor(props) {
        super(props)
    
    }
    
    render() {
        const {
            startLabel,
            stopLabel,
            onStart,
            onStop,
            running,
            timeRange,
        } = this.props

        return (
            <CustomTimeJobButton
                startLabel={startLabel}
                stopLabel={stopLabel}
                onStart={onStart}
                onStop={onStop}
                running={running}
                selected={timeRange}
            />
        )
    }
}

const {string, func, bool, shape} = PropTypes

TrainTimeJobButton.propTypes = {
    startLabel: string,
    stopLabel: string,
    onStart: func,
    onStop: func,
    running: bool,
    timeRange: shape({
        lower: string,
        upper: string,
        }),
}

export default TrainTimeJobButton
