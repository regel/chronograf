import React from 'react'
import PropTypes from 'prop-types'

const PredictionPanel = ({
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
        <h2 className="panel-title">
        </h2>
      </div>
      <div className="panel-body">
        <div className="form-group col-xs-12 col-sm-6">
          <label htmlFor="span">Interval</label>
          <input
            type="text"
            name="interval"
            className="form-control input-sm form-malachite"
            value={model.interval}
            onChange={onInputChange}
            placeholder="ex: 30s, 5m, 1h, 1d, ..."
          />
        </div>
        <div className="form-group col-xs-12 col-sm-6">
          <label htmlFor="offset">Offset</label>
          <input
            type="text"
            name="offset"
            className="form-control input-sm form-malachite"
            value={model.offset}
            onChange={onInputChange}
            placeholder="ex: 5s, 1m, 1h, 1d, ..."
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

PredictionPanel.propTypes = {
  model: shape({}),
  onInputChange: func.isRequired,
}

export default PredictionPanel
