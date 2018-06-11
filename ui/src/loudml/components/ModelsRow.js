import React from 'react'
import {PropTypes} from 'prop-types'
import {Link} from 'react-router'

import DeleteConfirmTableCell from 'src/shared/components/DeleteConfirmTableCell'

import ModelStatus from 'src/loudml/components/ModelStatus'
import ModelActions from 'src/loudml/components/ModelActions'

import 'src/loudml/styles/loudml.css'

const ModelsRow = ({
    source: {id},
    model,
    jobs,
    onStart,
    onStop,
    onTrain,
    onDelete,
    onStopTrain,
    onForecast,
    onStopForecast,
}) => {
    return (
        <tr>
            <td>
                <Link to={`/sources/${id}/loudml/models/${model.settings.name}/edit`}>
                    {model.settings.name}
                </Link>
            </td>
            <td>
                <ModelStatus
                    model={model}
                    jobs={jobs}
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

ModelsRow.propTypes = {
    source: PropTypes.shape().isRequired,
    model: PropTypes.shape({}),
    jobs: PropTypes.arrayOf(PropTypes.shape({})),
    onDelete: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onTrain: PropTypes.func.isRequired,
    onStopTrain: PropTypes.func.isRequired,
    onForecast: PropTypes.func.isRequired,
    onStopForecast: PropTypes.func.isRequired,
}

export default ModelsRow
