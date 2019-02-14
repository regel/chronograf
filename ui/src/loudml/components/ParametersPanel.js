import React from 'react'
import {PropTypes} from 'prop-types'

import LockablePanel from 'src/loudml/components/LockablePanel'

const ParametersPanel = ({
    model,
    onInputChange,
    locked,
}) => {
    
    return (
        <LockablePanel locked={locked}>
            <div className="panel-heading">
                <h2 className="panel-title"></h2>
            </div>
            <div className="panel-body">
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="bucket_interval">groupBy bucket interval</label>
                    <input
                        type="text"
                        name="bucket_interval"
                        className="form-control input-md form-malachite"
                        value={model.bucket_interval}
                        onChange={onInputChange}
                        placeholder="ex: 30s, 20m, 1h, 1d, ..."
                        disabled={locked}
                    />
                </div>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="span">Span</label>
                    <input
                        type="number"
                        name="span"
                        className="form-control input-md form-malachite"
                        value={model.span}
                        onChange={onInputChange}
                        placeholder="ex: 5"
                        min={1}
                        required={true}
                        disabled={locked}
                    />
                </div>
            </div>
        </LockablePanel>
    )
}

const {func, shape, bool} = PropTypes

ParametersPanel.propTypes = {
    model: shape({}),
    onInputChange: func.isRequired,
    locked: bool.isRequired,
}

export default ParametersPanel
