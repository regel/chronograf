import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import uuid from 'uuid'
import classnames from 'classnames'

import OnClickOutside from 'shared/components/OnClickOutside'
import ReactTooltip from 'react-tooltip'

import {notify as notifyAction} from 'shared/actions/notifications'

import {
    nab,
} from 'src/loudml/apis'

import {
    notifyNabLoading,
    notifyNabLoadingFailed,
    notifyNabLoaded,
} from 'src/loudml/actions/notifications'

import { findDatabases } from 'src/loudml/utils/datasource';
import { getDatasources } from 'src/loudml/apis';
import { parseError } from 'src/loudml/utils/error';

class LoadData extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            databases: [],
            uuidTooltip: uuid.v4(),
            isOpen: false,
        }
    }

    componentDidMount() {
        this._getDatabases()
    }

    render() {
        const {
            databases,
            uuidTooltip,
            isOpen,
        } = this.state
        
        return (
            <div
                className={classnames({
                    'disabled': !this.isValid,
                    })}
                    >
                <div className={classnames('dropdown dropdown-160', {open: isOpen})}>
                    <div
                        className="btn btn-sm btn-default dropdown-toggle"
                        onClick={this.toggleMenu}
                        data-for={uuidTooltip}
                        data-tip="Load real world data from the public data set called 'nab'<br>(https://github.com/numenta/NAB)"
                        ref='tooltip'
                    >
                        <span className="dropdown-selected">Load real-world data</span>
                        <span className="caret" />
                        <ReactTooltip
                            id={uuidTooltip}
                            effect="solid"
                            html={true}
                            place="bottom"
                            class="influx-tooltip"
                        />
                    </div>
                    <ul className="dropdown-menu">
                        {databases.map(item => (
                        <li className="dropdown-item" key={item.name}>
                            <a href="#" onClick={this.handleSelection(item)}>
                            {item.database}.{item.retention_policy}
                            </a>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    _getDatabases = async () => {
        const {source} = this.props
        const {data} = await getDatasources()
        const databases = findDatabases(source, data)
        this.setState({databases})
    }

    toggleMenu = () => {
        const {isOpen} = this.state
        if (!isOpen) {
            ReactTooltip.hide(this.refs.tooltip)
        }
        this.setState({isOpen: !this.state.isOpen})
    }

    handleClickOutside() {
        this.setState({isOpen: false})
      }
    
    handleSelection = datasource => () => {
        const {notify} = this.props
        const database = `${datasource.database}.${datasource.retention_policy}`
        nab(datasource.name)
            .then(() => {
                notify(notifyNabLoaded(database))
            })
            .catch(error => {
                notify(notifyNabLoadingFailed(database, parseError(error)))
            })
        notify(notifyNabLoading(database))
        this.setState({isOpen: false})
    }
    
    get isValid() {
        const {databases} = this.state
        return databases&&databases.length
    }

}

const {shape, func} = PropTypes

LoadData.propTypes = {
    source: shape({}),
    notify: func.isRequired,
}

const mapDispatchToProps = dispatch => ({
    notify: message => dispatch(notifyAction(message)),
})

export default connect(null, mapDispatchToProps)(OnClickOutside(LoadData))
