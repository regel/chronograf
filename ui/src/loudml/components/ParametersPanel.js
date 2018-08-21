import React from 'react'
import {PropTypes} from 'prop-types'

const ParametersPanel = ({
    model,
    onInputChange,
}) => {
    function handleSeasonality(e) {
        const {name, id, checked} = e.target
    
        onInputChange({
            target: {
                name,
                type: 'custom',
                value : {
                    ...model.seasonality,
                    [id]: checked,
                }
            }
        })
    }
    
    return (
        <div className="panel panel-solid">
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
                    />
                </div>
                <div className="form-group col-xs-12 col-sm-6">
                    <label>Seasonality</label>
                    <div className="form-control-static">
                        <div className="col-xs-12 col-sm-6">
                            <input
                            type="checkbox"
                            id="daytime"
                            name="seasonality"
                            checked={model.seasonality.daytime}
                            onChange={handleSeasonality}
                                />
                            <label htmlFor="daytime">Daytime</label>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <input
                                type="checkbox"
                                id="weekday"
                                name="seasonality"
                                checked={model.seasonality.weekday}
                                onChange={handleSeasonality}
                                />
                                <label htmlFor="weekday">Weekday</label>
                        </div>
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
