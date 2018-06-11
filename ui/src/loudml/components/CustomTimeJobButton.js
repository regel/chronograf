import React, { Component } from 'react'
import {PropTypes} from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'

import OnClickOutside from 'shared/components/OnClickOutside'

import CustomTimeRange from 'src/loudml/components/CustomTimeRange'
import JobButton from 'src/loudml/components/JobButton'
const emptyTime = {lower: '', upper: ''}

import 'src/loudml/styles/loudml.css'

class CustomTimeJobButton extends Component {
    constructor(props) {
        super(props)
        const {lower, upper} = props.selected

        const isTimeValid = moment(upper).isValid() && moment(lower).isValid()
        const customTimeRange = isTimeValid ? {lower, upper} : emptyTime
    
        this.state = {
            isCustomTimeRangeOpen: false,
            customTimeRange,
            isConfirmOpen: false,
        }
    }

    handleClickOutside = () => {
        this.setState({isCustomTimeRangeOpen: false})
    }

    toggleMenu = () => {
        this.setState({isCustomTimeRangeOpen: !this.state.isCustomTimeRangeOpen})
    }
    
    handleApplyCustomTimeRange = customTimeRange => {
        const {onStart} = this.props
        onStart(customTimeRange.lower, customTimeRange.upper)
        this.setState({customTimeRange, isCustomTimeRangeOpen: false})
    }

    handleToggleConfirm = () => {
        this.setState({isConfirmOpen: !this.state.isConfirmOpen})
    }

    render() {
        const {
            isCustomTimeRangeOpen,
            customTimeRange,
            isConfirmOpen,
        } = this.state

        const {
            startLabel,
            stopLabel,
            onStop,
            running,
            shortcuts,
            handleTimeRangeShortcut,
            disabled,
        } = this.props

        return (
            <div className="time-job--button">
                <div className={classnames(
                    'dropdown',
                    'dropdown-110', {
                        'table--show-on-row-hover': !(isCustomTimeRangeOpen||isConfirmOpen),
                        open: isCustomTimeRangeOpen,
                    })}>
                    {running ?
                        (<JobButton
                            stopLabel={stopLabel}
                            onStop={onStop}
                            running={running}
                            disabled={disabled}
                            informParent={this.handleToggleConfirm}
                        />)
                        : (<button className="btn btn-xs btn-default dropdown-toggle"
                            onClick={this.toggleMenu}
                            disabled={disabled}
                            >
                            <span className="icon clock" />
                            <span className="dropdown-selected">
                                {startLabel}
                            </span>
                            <span className="caret" />
                        </button>)}
                </div>
                {isCustomTimeRangeOpen ?
                    (<div className="custom-time--overlay">
                        <CustomTimeRange
                            onApplyTimeRange={this.handleApplyCustomTimeRange}
                            timeRange={customTimeRange}
                            onClose={this.handleClose}
                            shortcuts={shortcuts}
                            handleTimeRangeShortcut={handleTimeRangeShortcut}
                        />
                    </div>)
                : null}
            </div>
        )
    }
}

CustomTimeJobButton.defaultProps = {
    selected: {
        lower: null,
        upper: null,
    },
    disabled: false,
}
  
CustomTimeJobButton.propTypes = {
    startLabel: PropTypes.string.isRequired,
    stopLabel: PropTypes.string.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    running: PropTypes.bool,
    selected: PropTypes.shape({
        lower: PropTypes.string,
        upper: PropTypes.string,
    }),
    shortcuts: PropTypes.arrayOf(PropTypes.shape({})),
    handleTimeRangeShortcut: PropTypes.func,
    disabled: PropTypes.bool,
}

export default OnClickOutside(CustomTimeJobButton)
