import React, {PropTypes} from 'react'
import ModelHeaderSave from 'src/loudml/components/ModelHeaderSave'

const ModelHeader = ({
    name,
    onSave,
    validationError
}) => {
    return (
        <div className="panel">
            <div className="panel-heading">
                <h2 className="panel-title">
                    {name}
                </h2>
                <ModelHeaderSave
                    name={name}
                    onSave={onSave}
                    validationError={validationError}
                />
            </div>
        </div>
    )
}

ModelHeader.propTypes = {
    name: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    validationError: PropTypes.string,
}

export default ModelHeader
