import React from 'react'
import {PropTypes} from 'prop-types'

import CustomTimeJobButton from 'src/loudml/components/CustomTimeJobButton'

export const TrainTimeJobButton = ({
    startLabel,
    stopLabel,
    onStart,
    onStop,
    running,
    timeRange,
}) => {
    
    return (
        <CustomTimeJobButton
            startLabel={startLabel}
            stopLabel={stopLabel}
            onStart={onStart}
            onStop={onStop}
            running={running}
            selected={timeRange}
        />
    );
  }

const {string, func, bool, shape} = PropTypes

TrainTimeJobButton.propTypes = {
    startLabel: string,
    stopLabel: string,
    onStart: func,
    onStop: func,
    running: bool,
    timeRange: shape({
        lower: string.isRequired,
        upper: string,
        }),
}

export default TrainTimeJobButton
