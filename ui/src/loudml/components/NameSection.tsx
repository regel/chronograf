import React, {SFC} from 'react'

interface Props {
    name: string
    onEdit: (e: any) => void
    isEditing: boolean
}

const NameSection: SFC<Props> = ({
    name,
    onEdit,
    isEditing,
}) => {
    if (isEditing) {
        return (
            <div className="model--name">
                <input
                    type="text"
                    name="name"
                    className="form-control input-sm"
                    onChange={onEdit}
                    value={name}
                    placeholder="Name this model"
                />
            </div>
        )
    }
        
    return (
        <h3>{name}</h3>        
    )
}

export default NameSection
