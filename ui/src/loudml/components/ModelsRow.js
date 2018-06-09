import React from 'react'
import {PropTypes} from 'prop-types'
import {Link} from 'react-router'

import DeleteConfirmTableCell from 'src/shared/components/DeleteConfirmTableCell'

import ModelStatus from 'src/loudml/components/ModelStatus'
import JobButton from 'src/loudml/components/JobButton'
import TimeJobButton from 'src/loudml/components/TimeJobButton'

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
}) => {
    function handleOnTrain(lower, upper) {
        onTrain(model.settings.name, lower, upper)
    }

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
                />
            </td>
            <td className="text-right">
                <div className="jobs-container">
                    <JobButton
                        startLabel='Predict'
                        stopLabel='Stop prediction'
                        onStart={onStart(model.settings.name)}
                        onStop={onStop(model.settings.name)}
                        running={model.settings.run!==undefined}
                        disabled={model.state.trained===false
                            &&model.settings.run===undefined}
                    />
                    <TimeJobButton
                        startLabel='Train'
                        stopLabel='Stop train'
                        onStart={handleOnTrain}
                        onStop={onStopTrain(model.settings.name)}
                        running={
                            (model.training&&model.training.state==='running')
                            || jobs.filter(job => job.name === model.settings.name).length !== 0
                        }
                    />
                </div>
            </td>
            <DeleteConfirmTableCell
                onDelete={onDelete(model.settings.name)}
                item={model}
                buttonSize="btn-xs"
            />
        </tr>
    )
}
/*
*/
ModelsRow.propTypes = {
    source: PropTypes.shape().isRequired,
    model: PropTypes.shape({}),
    jobs: PropTypes.arrayOf(PropTypes.shape({})),
    onStop: PropTypes.func.isRequired,
    onTrain: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onStopTrain: PropTypes.func.isRequired,
}

export default ModelsRow
