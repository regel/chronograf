import React from 'react'
import {PropTypes} from 'prop-types'

import JobButton from 'src/loudml/components/JobButton'
import TrainTimeJobButton from 'src/loudml/components/TrainTimeJobButton'
import ForecastTimeJobButton from 'src/loudml/components/ForecastTimeJobButton'

const ModelActions = ({
    model,
    jobs,
    onStart,
    onStop,
    onTrain,
    onStopTrain,
    onForecast,
    onStopForecast,
}) => {
    function handleOnTrain(timeRange) {
        onTrain(model.settings.name, timeRange)
    }

    function handleOnForecast(timeRange) {
        onForecast(model.settings.name, timeRange)
    }

    return (
        <div className="jobs-container">
            <JobButton
                startLabel='Play'
                stopLabel='Stop'
                onStart={onStart(model.settings.name)}
                onStop={onStop(model.settings.name)}
                running={model.settings.run!==undefined}
                disabled={model.state.trained===false
                    &&model.settings.run===undefined}
            />
            <ForecastTimeJobButton
                startLabel='Forecast'
                stopLabel='Stop forecast'
                onStart={handleOnForecast}
                onStop={onStopForecast(model.settings.name)}
                disabled={model.state.trained===false}
                running={
                    jobs.filter(
                        job =>
                            job.name === model.settings.name
                            && job.type === 'forecast'
                    ).length !== 0
                }
            />
            <TrainTimeJobButton
                startLabel='Train'
                stopLabel='Stop training'
                onStart={handleOnTrain}
                onStop={onStopTrain(model.settings.name)}
                running={
                    (model.training&&model.training.state==='running')
                    || jobs.filter(
                        job =>
                            job.name === model.settings.name
                            && job.type === 'training'
                        ).length !== 0
                }
            />
        </div>
    )
}

const {arrayOf, func, shape} = PropTypes

ModelActions.propTypes = {
    model: shape({}).isRequired,
    jobs: arrayOf(PropTypes.shape({})),
    onStart: func.isRequired,
    onStop: func.isRequired,
    onTrain: func.isRequired,
    onStopTrain: func.isRequired,
    onForecast: func.isRequired,
    onStopForecast: func.isRequired,
}

export default ModelActions