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
        const {informParent} = this.props
    
        if (expanded === false) {
          return
        }
        this.setState({expanded: false})
        informParent()
      }
    
    handleToggleSubMenu = () => {
        const {running, onStart, informParent} = this.props

        if (running) {
            this.setState({expanded: !this.state.expanded})
            informParent()
        } else {
            onStart()
        }
    }
    
    handleConfirm = () => {
        const {informParent} = this.props
        this.setState({expanded: false})
        informParent()
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

JobButton.defaultProps = {
    informParent: () => {},
    onStart: () => {},
    startLabel: '',
}

JobButton.propTypes = {
    startLabel: PropTypes.string,
    stopLabel: PropTypes.string.isRequired,
    onStart: PropTypes.func,
    onStop: PropTypes.func.isRequired,
    running: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    informParent: PropTypes.func,
}

export default OnClickOutside(JobButton)
