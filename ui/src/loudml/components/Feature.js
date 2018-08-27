import React, {PropTypes} from 'react'

import Dropdown from 'shared/components/Dropdown'

import FeatureHeader from 'src/loudml/components/FeatureHeader';
import FillQuery from 'src/loudml/components/FillQuery';
import FeatureTags from 'src/loudml/components/FeatureTags'

import {
    normalizeFeatureDefault,
    denormalizeFeatureDefault,
 } from 'src/loudml/utils/model';

import {DEFAULT_METRICS, DEFAULT_IO} from 'src/loudml/constants'
import {DEFAULT_ANOMALY_TYPE} from 'src/loudml/constants/anomaly'

const Feature = ({
    feature,
    onDelete,
    onEdit,
    onKeyDown,
    onConfirm,
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
        onEdit(feature, {default: normalizeFeatureDefault(item)})
    }

    function handleEditFeature(f) {
        return function (e) {
            onEdit(f, { name: e.target.value })
        }
    }

    return(
        <div className="db-manager">
            <FeatureHeader
                feature={feature}
                onDelete={onDelete}
                onEdit={handleEditFeature}
                onKeyDown={onKeyDown}
                onCancel={onDelete}
                onConfirm={onConfirm}
            />
            <div style={{'borderBottom': '2px solid #383846'}} />
            <table className="table v-center table-feature">
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="bucket_interval">Measurement</label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="measurement"
                                className="form-control input-sm form-malachite"
                                defaultValue={feature.measurement}
                                onChange={handleEdit}
                                placeholder="measurement"
                                // style={{width: '100px'}}
                            />
                        </td>
                        <td>
                            <label htmlFor="field">Field</label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="field"
                                className="form-control input-sm form-malachite"
                                defaultValue={feature.field}
                                onChange={handleEdit}
                                placeholder="field"
                                // style={{width: '100px'}}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="metric">Metric</label>
                        </td>
                        <td>
                            <Dropdown
                                name="metric"
                                onChoose={handleMetricChoose}
                                items={DEFAULT_METRICS.map(m => ({text: m}))}
                                selected={feature.metric}
                                // className="dropdown-100"
                                buttonSize="btn-sm"
                                />
                        </td>
                        <td>
                            <label>Default</label>
                        </td>
                        <td>
                            <FillQuery
                                value={denormalizeFeatureDefault(feature.default)}
                                onChooseFill={handleFillChoose}
                                theme="GREEN"
                                size="sm" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="io">Input/Output</label>
                        </td>
                        <td>
                            <Dropdown
                                name="io"
                                onChoose={handleIOChoose}
                                items={DEFAULT_IO}
                                selected={DEFAULT_IO.find(i => i.value === feature.io).text}
                                // className="dropdown-80"
                                buttonSize="btn-sm"
                            />
                        </td>
                        <td>
                            <label htmlFor="anomaly_type">Anomaly type</label>
                        </td>
                        <td>
                            <Dropdown
                                name="anomaly_type"
                                onChoose={handleAnomalyChoose}
                                items={DEFAULT_ANOMALY_TYPE}
                                selected={DEFAULT_ANOMALY_TYPE.find(a => a.value === feature.anomaly_type).text}
                                // className="dropdown-80"
                                buttonSize="btn-sm"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <FeatureTags tag={feature.match_all} />
        </div>
    )
}

const {func, shape} = PropTypes

Feature.propTypes = {
    feature: shape({}).isRequired,
    onDelete: func.isRequired,
    onEdit: func.isRequired,
    onKeyDown: func.isRequired,
    onConfirm: func.isRequired,
}

export default Feature
