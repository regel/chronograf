import React from 'react'
import {PropTypes} from 'prop-types'

const ModelStatus = ({
    model,
}) => {
    return (
        <div>
            {model.settings.run ?
                <code>Running</code>
                : null
            }
            {model.training ?
                <code>
                    Train {model.training.state}
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
