import React, {PropTypes} from 'react'

const NameSection = ({
  modelName,
  onEdit,
  isCreating,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="name">
        {isCreating ? 'Name this model' : 'Name'}
      </label>
      {isCreating
        ? <input
            type="text"
            name="name"
            className="form-control input-md form-malachite"
            onChange={onEdit}
            placeholder="ex: my-model"
          />
        : <p>
            {modelName}
          </p>
      }
    </div>
  )
}

NameSection.propTypes = {
  modelName: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
}

export default NameSection
