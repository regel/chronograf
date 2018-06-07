import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import OnClickOutside from 'react-onclickoutside'
import classnames from 'classnames'

class JobButton extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            expanded: false,
        }
    }

    handleClickOutside = () => {
        const {expanded} = this.state
    
        if (expanded === false) {
          return
        }
        this.setState({expanded: false})
      }
    
    handleToggleSubMenu = () => {
        const {running, onStart} = this.props

        if (running) {
            this.setState({expanded: !this.state.expanded})
        } else {
            onStart()
        }
    }
    
    handleConfirm = () => {
        this.setState({expanded: false})
        this.props.onStop()
    }

    render() {
        const {
            disabled,
            running,
            stopLabel,
            startLabel,
        } = this.props
        const {expanded} = this.state

        return (
            <div style={{position: 'relative'}}>
                <button className={classnames(
                    'btn',
                    'btn-xs',
                    'btn-default', {
                        'table--show-on-row-hover': !expanded,
                    })}
                    onClick={this.handleToggleSubMenu}
                    disabled={disabled}>
                    {running ? stopLabel : startLabel}
                </button>
                {expanded ? (
                    <div className="dash-graph-context--menu danger">
                        <div className="dash-graph-context--menu-item"
                            onClick={this.handleConfirm} >
                            Confirm
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}
//  className={classnames('dash-graph-context--button', {active: expanded})}
JobButton.propTypes = {
    startLabel: PropTypes.string.isRequired,
    stopLabel: PropTypes.string.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    running: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
}

export default OnClickOutside(JobButton)
