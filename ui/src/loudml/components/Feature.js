import React, {PropTypes} from 'react'

import Dropdown from 'shared/components/Dropdown'

import FeatureHeader from 'src/loudml/components/FeatureHeader';
import FillQuery from 'src/loudml/components/FillQuery';

import {DEFAULT_METRICS, DEFAULT_IO} from 'src/loudml/constants'
import {DEFAULT_ANOMALY_TYPE} from 'src/loudml/constants/anomaly'

const Feature = ({
    feature,
    onDelete,
    onEdit,
}) => {
    function handleEdit(e) {
        const val = (e.target.type==='number'?Number(e.target.value):e.target.value)
        const name = e.target.name

        onEdit(feature, {[name]: val})
    }

    function handleMetricChoose(item) {
        onEdit(feature, {metric: item.text})
    }

    function handleIOChoose(item) {
        onEdit(feature, {io: item.value})
    }

    function handleAnomalyChoose(item) {
        onEdit(feature, {anomaly_type: item.value})
    }

    function handleFillChoose(item) {
        onEdit(feature, {io: item.value})
    }

    return(
        <div className="db-manager">
            <FeatureHeader
                feature={feature}
                onDelete={onDelete}
            />
            <div style={{'borderBottom': '2px solid #383846'}} />
            <div className='feature-row'>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="name">groupBy bucket interval</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control input-xs form-malachite"
                        defaultValue={feature.name}
                        onChange={handleEdit}
                        placeholder="ex: myfeature"
                        // style={{width: '100px'}}
                    />
                </div>
            </div>
            <div className='feature-row'>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="bucket_interval">Measurement</label>
                    <input
                        type="text"
                        name="measurement"
                        className="form-control input-xs form-malachite"
                        defaultValue={feature.measurement}
                        onChange={handleEdit}
                        placeholder="measurement"
                        // style={{width: '100px'}}
                    />
                </div>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="field">Field</label>
                    <input
                        type="text"
                        name="field"
                        className="form-control input-xs form-malachite"
                        defaultValue={feature.field}
                        onChange={handleEdit}
                        placeholder="field"
                        // style={{width: '100px'}}
                    />
                </div>
            </div>
            <div className='feature-row'>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="metric">Metric</label>
                    <Dropdown
                        name="metric"
                        onChoose={handleMetricChoose}
                        items={DEFAULT_METRICS.map(m => ({text: m}))}
                        selected={feature.metric}
                        // className="dropdown-100"
                        buttonSize="btn-xs"
                    />
                </div>
            </div>
            <div className='feature-row'>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="default">Fill</label>
                    <input
                        type="number"
                        className="form-control input-xs form-malachite"
                        name="default"
                        defaultValue={feature.default}
                        onChange={handleEdit}
                        placeholder="ex: 0"
                        // style={{width: '100px'}}
                    />
                    <FillQuery value={feature.fill} onChooseFill={handleFillChoose} />
                </div>
            </div>
            <div className='feature-row'>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="io">Input/Output</label>
                    <Dropdown
                        name="io"
                        onChoose={handleIOChoose}
                        items={DEFAULT_IO}
                        selected={DEFAULT_IO.find(i => i.value === feature.io).text}
                        // className="dropdown-80"
                        buttonSize="btn-xs"
                    />
                </div>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="anomaly_type">Anomaly type</label>
                    <Dropdown
                        name="anomaly_type"
                        onChoose={handleAnomalyChoose}
                        items={DEFAULT_ANOMALY_TYPE}
                        selected={DEFAULT_ANOMALY_TYPE.find(a => a.value === feature.anomaly_type).text}
                        // className="dropdown-80"
                        buttonSize="btn-xs"
                    />
                </div>
            </div>
        </div>
    )
}

Feature.propTypes = {
    feature: PropTypes.shape({}).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
}

export default Feature
