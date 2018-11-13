import React, { SFC, ReactNode } from 'react'

interface Props {
    locked: boolean
    children: ReactNode
}

const LockablePanel: SFC<Props> = ({
    locked,
    children,
}) => {

    return (
        <div className="panel panel-solid">
            {locked
                ?(<div className="panel-heading">
                    <h6><span className="icon stop" /> This panel is locked</h6>
                </div>)
                :null}
            {children}
        </div>
    )
}

export default LockablePanel
