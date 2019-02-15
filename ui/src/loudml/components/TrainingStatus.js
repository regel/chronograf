import React from 'react'
import {PropTypes} from 'prop-types'

import ProgressCode from 'src/loudml/components/ProgressCode'

const TrainingStatus = ({
    training,
    state,
}) => {
    const Trained = (<code>Trained.</code>)

    if (training) {
        const {progress} = training
        if (training.state==='running') {
            return (
                <ProgressCode
                    max={(progress && progress.max_evals)||1}
                    value={(progress && progress.eval)||0}
                    label='Training' />
            )
        }
        if (training.state !== 'done') {
            return (
                <code>
                    Training&nbsp;{training.state}.
                </code>
            )
        }
        return Trained
    }
    if (state&&state.trained) {
        return Trained
    }
    return null
}

const {shape} = PropTypes

TrainingStatus.propTypes = {
    training: shape({}),
    state: shape({}).isRequired,
}

export default TrainingStatus