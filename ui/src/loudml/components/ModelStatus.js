import React from 'react'
import {PropTypes} from 'prop-types'

const ModelStatus = ({
    model,
    jobs,
}) => {
    return (
        <div>
            {model.settings.run ?
                <code>Running</code>
                : null
            }
            {model.training ?
                <code>
                    Train&nbsp;{model.training.state}
                </code>
                : null
            }
            {jobs.map(job => (
                <code key={job.id}>
                    {job.type}&nbsp;{job.state}
                </code>)
            )}
        </div>
    )
}

ModelStatus.propTypes = {
    model: PropTypes.shape({}).isRequired,
    jobs: PropTypes.arrayOf(PropTypes.shape({})),
}

export default ModelStatus
