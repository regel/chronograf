import React, {PropTypes} from 'react'

const NameSection = ({
    modelName,
    onEdit,
    isCreating,
}) => {
    if (!isCreating) {
        return (
            <div>{modelName}</div>
        )
    }    

    return (
        <input
            type="text"
            name="name"
            className="form-control input-md form-malachite"
            onChange={onEdit}
            placeholder="ex: my-model"
        />
    )
}

NameSection.propTypes = {
    modelName: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
}

export default NameSection
