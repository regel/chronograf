import React from 'react'
import {PropTypes} from 'prop-types'

import OptIn from 'src/shared/components/OptIn';
import OnOff from 'src/loudml/components/OnOff';

const AnomalyPanel = ({
    model,
    annotation,
    onAnnotationChange,
    onThresholdChange,
}) => {
    function onSetThreshold(field) {
        
        return (value) => {
            onThresholdChange(field, value)
        }
    }

    return (

        <div className="panel panel-solid">
            <div className="panel-heading">
                <h2 className="panel-title"></h2>
            </div>
            <div className="panel-body">
                <div className="row">
                    <div className="form-group col-sm-4 col-md-4">
                        <label>Min threshold</label>
                        <OptIn
                            name="min_threshold"
                            min="0.1"
                            type="number"
                            max="100"
                            customValue={(model.min_threshold===0?'':model.min_threshold)}
                            customPlaceholder="ex: 100"
                            fixedValue="0"
                            onSetValue={onSetThreshold('min_threshold')}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-sm-4 col-md-4">
                        <label>Max threshold</label>
                        <OptIn
                            name="max_threshold"
                            min="0.1"
                            type="number"
                            max="100"
                            customValue={(model.max_threshold===0?'':model.max_threshold)}
                            customPlaceholder="ex: 100"
                            fixedValue="0"
                            onSetValue={onSetThreshold('max_threshold')}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-4">
                        <label htmlFor="add_annotation">Annotations</label>
                        <OnOff
                            value={annotation}
                            onSetValue={onAnnotationChange}
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}

const {func, shape, bool} = PropTypes

AnomalyPanel.propTypes = {
    model: shape({}).isRequired,
    annotation: bool.isRequired,
    onThresholdChange: func.isRequired,
    onAnnotationChange: func.isRequired,
}

export default AnomalyPanel
