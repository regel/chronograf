import React from 'react'
import {PropTypes} from 'prop-types'

import ProgressCode from 'src/loudml/components/ProgressCode'

import 'src/loudml/styles/status.css'

const ModelStatus = ({
    model,
    jobs,
}) => {
    return (
        <div className="status">
            {model.settings.run ?
                <code>Running</code>
                : null
            }
            {model.training
                && model.training.state==='running'
                && model.training.progress !== undefined ? (
                <ProgressCode
                    max={model.training.progress.max_evals}
                    value={model.training.progress.eval}
                    label={`Train ${model.training.state}`} />
                ) : null}
            {model.training && model.training.state !== 'running' ? (
                <code>
                    Train&nbsp;{model.training.state}
                </code>
            ) : null}
            {jobs
                .filter(job => job.type==='forecast')
                .map(job => (
                <code key={job.id}>
                    {job.type}&nbsp;{job.state}
                </code>)
            )}
        </div>
    )
}
/*
            {model.training
                && model.training.state==='running'
                && model.training.progress !== undefined ? (
                <Progress 
                    maxEvals={model.training.progress.max_evals}
                    iteration={model.training.progress.eval} />
                ) : null}
                        <Progress 
                            maxEvals={model.training.progress.max_evals}
                            eval={model.training.progress.max_evals} />
                    <progress
                        value={model.training.progress.max_evals}
                        max={model.training.progress.max_evals}>
                    </progress>
*/

ModelStatus.propTypes = {
    model: PropTypes.shape({}).isRequired,
    jobs: PropTypes.arrayOf(PropTypes.shape({})),
}

export default ModelStatus
