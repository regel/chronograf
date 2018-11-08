import React, {SFC} from 'react'

interface Props {
    value: string|number
}

const DisabledValue: SFC<Props> = ({
    value,
}) => {
        
    return (
        <div>
            <span className="empty-string">{value}</span>
        </div>
    )
}

export default DisabledValue
