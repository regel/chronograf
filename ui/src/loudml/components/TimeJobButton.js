import React, { Component } from 'react'
import {PropTypes} from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'

import OnClickOutside from 'shared/components/OnClickOutside'
import CustomTimeRangeOverlay from 'shared/components/CustomTimeRangeOverlay'

const emptyTime = {lower: '', upper: ''}

import 'src/loudml/styles/loudml.css'

class TimeJobButton extends Component {
    constructor(props) {
        super(props)
        const {lower, upper} = props.selected

        const isTimeValid = moment(upper).isValid() && moment(lower).isValid()
        const customTimeRange = isTimeValid ? {lower, upper} : emptyTime
    
        this.state = {
            isCustomTimeRangeOpen: false,
            customTimeRange,
        }
    }

    handleClickOutside = () => {
        this.setState({isCustomTimeRangeOpen: false})
    }

    toggleMenu = () => {
        this.setState({isCustomTimeRangeOpen: !this.state.isCustomTimeRangeOpen})
    }
    
    handleClose = () => {}  // CustomTimeRangeOverlay
    handleToggle = () => {} // CustomTimeRangeOverlay

    handleApplyCustomTimeRange = customTimeRange => {
        const {onStart} = this.props
        onStart(customTimeRange.lower, customTimeRange.upper)
        this.setState({customTimeRange, isCustomTimeRangeOpen: false})
    }

    render() {
        const {
            isCustomTimeRangeOpen,
            customTimeRange,
        } = this.state

        const {
            startLabel,
            stopLabel,
            onStop,
            running,
            page,
        } = this.props

        return (
            <div className="time-job--button">
                <div className={classnames(
                    'dropdown',
                    'dropdown-80', {
                        'table--show-on-row-hover': !isCustomTimeRangeOpen,
                        open: isCustomTimeRangeOpen,
                    })}>
                    {running ?
                        (<button className="btn btn-xs btn-default"
                            onClick={onStop}
                            >
                            {stopLabel}
                        </button>)
                        : (<button className="btn btn-xs btn-default dropdown-toggle"
                            onClick={this.toggleMenu}
                            >
                            <span className="icon clock" />
                            <span className="dropdown-selected">
                                {startLabel}
                            </span>
                            <span className="caret" />
                        </button>)}
                </div>
                {isCustomTimeRangeOpen ?
                    (<CustomTimeRangeOverlay
                        onApplyTimeRange={this.handleApplyCustomTimeRange}
                        timeRange={customTimeRange}
                        isVisible={isCustomTimeRangeOpen}
                        onToggle={this.handleToggle}
                        onClose={this.handleClose}
                        page={page}
                    />)
                : null}
            </div>
        )
    }
}

TimeJobButton.defaultProps = {
    page: 'default',
    selected: {
        lower: null,
        upper: null,
    },
}
  
TimeJobButton.propTypes = {
    startLabel: PropTypes.string.isRequired,
    stopLabel: PropTypes.string.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    running: PropTypes.bool,
    selected: PropTypes.shape({
        lower: PropTypes.string,
        upper: PropTypes.string,
    }),
    page: PropTypes.string,
}

export default OnClickOutside(TimeJobButton)
