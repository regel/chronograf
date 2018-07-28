import React from 'react'
import {PropTypes} from 'prop-types'
import {Link} from 'react-router'

import DeleteConfirmTableCell from 'src/shared/components/DeleteConfirmTableCell'

import ModelStatus from 'src/loudml/components/ModelStatus'
import ModelActions from 'src/loudml/components/ModelActions'
import DashboardDropdown from 'src/loudml/components/DashboardDropdown'

import 'src/loudml/styles/loudml.css'

const ModelsRow = ({
    source: {id},
    model,
    model: {state: {loss}},
    jobs,
    onStart,
    onStop,
    onTrain,
    onDelete,
    onStopTrain,
    onForecast,
    onStopForecast,
    onSelectModelGraph,
}) => {
    
    return (
        <tr>
            <td>
                <Link to={`/sources/${id}/loudml/models/${model.settings.name}/edit`}>
                    {model.settings.name}
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
                <DashboardDropdown
                    model={model}
                    onChoose={onSelectModelGraph}
                />
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
                onDelete={onDelete(model.settings.name)}
                item={model}
                buttonSize="btn-xs"
            />
        </tr>
    )
}

const {shape, arrayOf, func} = PropTypes

ModelsRow.propTypes = {
    source: shape().isRequired,
    model: shape({}),
    jobs: arrayOf(shape({})),
    onDelete: func.isRequired,
    onStart: func.isRequired,
    onStop: func.isRequired,
    onTrain: func.isRequired,
    onStopTrain: func.isRequired,
    onForecast: func.isRequired,
    onStopForecast: func.isRequired,
    onSelectModelGraph: func.isRequired,
}

export default ModelsRow
