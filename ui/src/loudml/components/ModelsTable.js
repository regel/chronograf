import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import ModelsRow from 'src/loudml/components/ModelsRow'

class ModelsTable extends Component {
    constructor(props) {
        super(props)
    }

    renderTable() {
        const {
            source,
            models,
            jobs,
            onDelete,
            onStart,
            onStop,
            onTrain,
            onStopTrain,
            onForecast,
            onStopForecast,
        } = this.props
    
        return (
            <table className="table v-center margin-bottom-zero table-highlight">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th className="admin-table--left-offset" />
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {models.map(model => {
                        return (
                            <ModelsRow key={model.settings.name}
                                model={model}
                                jobs={jobs.filter(job => job.name === model.settings.name)}
                                source={source}
                                onDelete={onDelete}
                                onStart={onStart}
                                onStop={onStop}
                                onTrain={onTrain}
                                onStopTrain={onStopTrain}
                                onForecast={onForecast}
                                onStopForecast={onStopForecast}
                            />
                        )
                    }, this)}
                </tbody>
            </table>
        )
    }

    renderTableEmpty() {
        const {source: {id}} = this.props
        return (
            <div className="generic-empty-state">
                <h4 className="no-user-select">No model</h4>
                <br />
                <h6 className="no-user-select">
                    <Link
                        style={{marginLeft: '10px'}}
                        to={`/sources/${id}/loudml/models/new`}
                        className="btn btn-primary btn-sm"
                    >
                        Create a model
                    </Link>
                </h6>
            </div>
        )
    }

    get title () {
        const {models} = this.props

        return `${models.length} Model${models.length>1 ? 's': ''}`
    }

    render() {
        const {source: {id}, models} = this.props
        return (
            <div className="panel">
                <div className="panel-heading">
                    <h2 className="panel-title">
                        {this.title}
                    </h2>
                    <Link
                        style={{marginLeft: '10px'}}
                        to={`/sources/${id}/loudml/models/new`}
                        className="btn btn-primary btn-sm"
                    >
                        <span className="icon plus" /> Create a new model
                    </Link>
                </div>
                <div className="panel-body">
                    {models.length ? this.renderTable() : this.renderTableEmpty() }
                </div>
            </div>
        )
    }
}

const {arrayOf, shape, string, func} = PropTypes

ModelsTable.propTypes = {
    models: arrayOf(
        shape()
    ),
    jobs: arrayOf(
        shape()
    ),
    source: shape({
        id: string.isRequired,
        name: string.isRequired,
    }).isRequired,
    onDelete: func.isRequired,
    onStart: func.isRequired,
    onStop: func.isRequired,
    onTrain: func.isRequired,
    onStopTrain: func.isRequired,
    onForecast: func.isRequired,
    onStopForecast: func.isRequired,
}

export default ModelsTable
