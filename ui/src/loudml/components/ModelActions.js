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
    function handleOnTrain(lower, upper) {
        onTrain(model.settings.name, lower, upper)
    }

    function handleOnForecast(lower, upper) {
        onForecast(model.settings.name, lower, upper)
    }

    return (
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
                stopLabel='Stop train'
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

ModelActions.propTypes = {
    model: PropTypes.shape({}).isRequired,
    jobs: PropTypes.arrayOf(PropTypes.shape({})),
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onTrain: PropTypes.func.isRequired,
    onStopTrain: PropTypes.func.isRequired,
    onForecast: PropTypes.func.isRequired,
    onStopForecast: PropTypes.func.isRequired,
}

export default ModelActions