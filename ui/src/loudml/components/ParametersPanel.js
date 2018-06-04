import React from 'react'
import {PropTypes} from 'prop-types'

const ParametersPanel = ({
    model,
    onInputChange,
}) => {
  return (
    <div className="panel panel-solid">
        <div className="panel-heading">
            <h2 className="panel-title"></h2>
        </div>
        <div className="panel-body">
            <div className="col-xs-6">
                <div className="form-group">
                    <label htmlFor="max_evals">Max iterations</label>
                    <input
                        type="number"
                        name="max_evals"
                        className="form-control input-sm form-malachite"
                        value={model.max_evals}
                        onChange={onInputChange}
                        placeholder="ex: 100"
                    />
                </div>
            </div>
            <div className="col-xs-6">
                <div className="form-group">
                    <label htmlFor="bucket_interval">Bucket interval</label>
                    <input
                        type="text"
                        name="bucket_interval"
                        className="form-control input-sm form-malachite"
                        value={model.bucket_interval}
                        onChange={onInputChange}
                        placeholder="ex: 30s, 20m, 1h, 1d, ..."
                    />
                </div>
            </div>
            <div className="col-xs-6">
                <div className="form-group">
                    <label htmlFor="span">Span</label>
                    <input
                        type="number"
                        name="span"
                        className="form-control input-sm form-malachite"
                        value={model.span}
                        onChange={onInputChange}
                        placeholder="ex: 5"
                        min={1}
                        required={true}
                    />
                </div>
            </div>
        </div>
    </div>
    )
}

const {func, shape} = PropTypes

ParametersPanel.propTypes = {
  model: shape({}),
  onInputChange: func.isRequired,
}

export default ParametersPanel
