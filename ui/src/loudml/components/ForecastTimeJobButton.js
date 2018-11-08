import React, { Component } from 'react'
import {PropTypes} from 'prop-types'

import moment from 'moment'

import CustomTimeJobButton from 'src/loudml/components/CustomTimeJobButton'

import {forecastTimeRangeDefaults} from 'src/loudml/constants/timeRange'
  
function handleTimeRangeShortcut(shortcut) {
    const lower = moment()
    let upper
  
    switch (shortcut) {
        case 'nextWeek': {
            upper = moment().add(1, 'week')
            break
        }
        case 'nextMonth': {
            upper = moment().add(1, 'month')
            break
        }
        case 'nextYear': {
            upper = moment().add(1, 'year')
            break
        }
        case 'thisWeek': {
            upper = moment().endOf('week')
            break
        }
        case 'thisMonth': {
            upper = moment().endOf('month')
            break
        }
        case 'thisYear': {
            upper = moment().endOf('year')
            break
        }
    }

    return {
      lower,
      upper,
    }
}

export class ForecastTimeJobButton extends Component {
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
            disabled,
            timeRange,
        } = this.props
    
        return (
            <CustomTimeJobButton
                startLabel={startLabel}
                stopLabel={stopLabel}
                onStart={onStart}
                onStop={onStop}
                running={running}
                shortcuts={forecastTimeRangeDefaults}
                handleTimeRangeShortcut={handleTimeRangeShortcut}
                disabled={disabled}
                now="lower"
                selected={timeRange}
                />
        )
    }

}

const {string, func, bool, shape} = PropTypes
    
ForecastTimeJobButton.propTypes = {
    startLabel: string.isRequired,
    stopLabel: string.isRequired,
    onStart: func.isRequired,
    onStop: func.isRequired,
    running: bool,
    disabled: bool,
    timeRange: shape({
        lower: string.isRequired,
        upper: string,
        }),
}

export default ForecastTimeJobButton
