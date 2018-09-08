import React, { PureComponent } from 'react'
import {Link} from 'react-router'

import {Model, TimeRange, Job} from 'src/loudml/types/model'
import DeleteConfirmTableCell from 'src/shared/components/DeleteConfirmTableCell'

import ModelStatus from 'src/loudml/components/ModelStatus'
import ModelActions from 'src/loudml/components/ModelActions'
import DashboardDropdown from 'src/loudml/components/DashboardDropdown'

import 'src/loudml/styles/loudml.css'

interface Props {    
    source: {id: string}
    model: Model
    jobs: Job[]
    onStart: (name: string) => void
    onStop: (name: string) => void
    onTrain: (name: string, timeRange: TimeRange) => void
    onStopTrain: (name: string) => void
    onDelete: (name: string) => void
    onForecast: (name: string, timeRange: TimeRange) => void
    onStopForecast: (name: string) => void
    onSelectModelGraph: (model: Model) => void
    onClone: (name: string) => void
}

class ModelsRow extends PureComponent<Props, {}> {
    constructor(props) {
        super(props)

        this.onClone = this.onClone.bind(this)
    }

    public onClone() {
        const {
            model: {settings: {name}},
            onClone,
        } = this.props

        onClone(name)
    }

    public render() {
        const {
            source: {id},
            model,
            model: {
                settings: {name},
                state: {loss},
            },
            jobs,
            onDelete,
            onStart,
            onStop,
            onTrain,
            onStopTrain,
            onForecast,
            onStopForecast,
            onSelectModelGraph,
        } = this.props

        return (
            <tr>
                <td>
                    <Link to={`/sources/${id}/loudml/models/${name}/edit`}>
                        {name}
                    </Link>
                </td>
                <td>
                    {loss&&loss.toFixed(5)}
                </td>
                <td>
                    <ModelStatus
                        model={model}
                        jobs={jobs}
                    />
                </td>
                <td className="text-right">
                    <div className="actions-container">
                        <button 
                            className="btn btn-xs btn-default btn-square table--show-on-row-hover"
                            title="Clone this model"
                            onClick={this.onClone}>
                            <span className="icon duplicate" />
                        </button>
                        <DashboardDropdown
                            model={model}
                            onChoose={onSelectModelGraph}
                            />
                    </div>
                </td>
                <td className="text-right">
                    <ModelActions
                        model={model}
                        jobs={jobs}
                        onStart={onStart}
                        onStop={onStop}
                        onTrain={onTrain}
                        onStopTrain={onStopTrain}
                        onForecast={onForecast}
                        onStopForecast={onStopForecast}
                    />
                </td>
                <DeleteConfirmTableCell
                    onDelete={onDelete(name)}
                    item={model}
                    buttonSize="btn-xs"
                />
            </tr>
        )
    }
}

export default ModelsRow
