import React from 'react'
import PropTypes from 'prop-types'
import ModelHeaderSave from 'src/loudml/components/ModelHeaderSave'
import NameSection from 'src/loudml/components/NameSection';

const ModelHeader = ({
    name,
    isEditing,
    onEdit,
    onSave,
    validationError
}) => (
        <div className="panel-heading">
            <NameSection
                name={name}
                isEditing={isEditing}
                onEdit={onEdit}
                />
            <div className="panel-controls">
                <ModelHeaderSave
                    name={name}
                    onSave={onSave}
                    validationError={validationError}
                />
            </div>
        </div>
    )

const {func, string, bool} = PropTypes

ModelHeader.propTypes = {
    name: string.isRequired,
    isEditing: bool.isRequired,
    onEdit: func.isRequired,
    onSave: func.isRequired,
    validationError: string,
}

export default ModelHeader
