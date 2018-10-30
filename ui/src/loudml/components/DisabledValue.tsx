import React, {SFC} from 'react'

interface Props {
    value: string|number
}

const DisabledValue: SFC<Props> = ({
    value,
}) => {
        
    return (
        <span className="empty-string">{value}</span>
    )
}

export default DisabledValue
