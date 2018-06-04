import React from 'react'
import {PropTypes} from 'prop-types'

const ModelStatus = ({
    model,
}) => {
    const trainingLabel = {
        waiting: 'training waiting',
        running: 'training',
        done: 'trained',
        failed: 'training failed'
    }
    return (
        <div>
            {model.settings.run ?
                <code>running</code>
                : null
            }
            {model.training ?
                <code>
                    {trainingLabel[model.training.state]}
                </code>
                : null
            }
      </div>
    )
}

ModelStatus.propTypes = {
  model: PropTypes.shape({}).isRequired,
}

export default ModelStatus
