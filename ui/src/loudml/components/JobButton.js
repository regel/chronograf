import React from 'react'
import {PropTypes} from 'prop-types'

const JobButton = ({
    startLabel,
    stopLabel,
    onStart,
    onStop,
    running,
}) => {
    function handleClick() {
        if (running) {
            onStop()
        } else {
            onStart()
        }
    }

    return (
        <button className="btn btn-xs btn-default table--show-on-row-hover"
            href="#"
            onClick={handleClick}>
            {running ? stopLabel : startLabel}
        </button>
    )
}

JobButton.propTypes = {
    startLabel: PropTypes.string.isRequired,
    stopLabel: PropTypes.string.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    running: PropTypes.bool.isRequired,
}

export default JobButton
