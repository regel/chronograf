import React, {PropTypes} from 'react'
import ModelHeaderSave from 'src/loudml/components/ModelHeaderSave'

const ModelHeader = ({
  onSave,
  validationError
}) => {
  return (
    <div className="panel">
      <div className="panel-heading">
        <h2 className="panel-title">
          Model creator
        </h2>
        <ModelHeaderSave
          onSave={onSave}
          validationError={validationError}
        />
      </div>
    </div>
  )
}

ModelHeader.propTypes = {
  onSave: PropTypes.func.isRequired,
  validationError: PropTypes.string,
}

export default ModelHeader
