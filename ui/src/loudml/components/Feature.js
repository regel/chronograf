import React, {PropTypes} from 'react'

import Dropdown from 'shared/components/Dropdown'
import DeleteConfirmTableCell from 'shared/components/DeleteConfirmTableCell'

import {DEFAULT_METRICS, DEFAULT_IO} from 'src/loudml/constants'

const Feature = ({
    feature,
    onDelete,
    onEdit,
}) => {
    function deleteFeature() {
        onDelete(feature)
    }

    function handleEdit(e) {
        const val = (e.target.type==='number'?Number(e.target.value):e.target.value)
        const name = e.target.name

        onEdit(feature, {[name]: val})
    }

    function handleMetricChoose(item) {
        onEdit(feature, {metric: item.text})
    }

    function handleIOChoose(item) {
        onEdit(feature, {io: item.text})
    }

    return(
        <tr>
            <td>
                <input
                    type="text"
                    name="name"
                    className="form-control input-xs form-malachite"
                    defaultValue={feature.name}
                    onChange={handleEdit}
                    placeholder="ex: myfeature"
                    style={{width: '100px'}}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="measurement"
                    className="form-control input-xs form-malachite"
                    defaultValue={feature.measurement}
                    onChange={handleEdit}
                    placeholder="measurement"
                    style={{width: '100px'}}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="field"
                    className="form-control input-xs form-malachite"
                    defaultValue={feature.field}
                    onChange={handleEdit}
                    placeholder="field"
                    style={{width: '100px'}}
                />
            </td>
            <td>
                <Dropdown
                    name="metric"
                    onChoose={handleMetricChoose}
                    items={DEFAULT_METRICS.map(m => ({text: m}))}
                    selected={feature.metric}
                    className="dropdown-80"
                    buttonSize="btn-xs"
                />
            </td>
            <td>
                <input
                    type="number"
                    className="form-control input-xs form-malachite"
                    name="default"
                    defaultValue={feature.default}
                    onChange={handleEdit}
                    placeholder="ex: 0"
                    style={{width: '100px'}}
                />
            </td>
            <td>
                <Dropdown
                    name="io"
                    onChoose={handleIOChoose}
                    items={DEFAULT_IO.map(m => ({text: m}))}
                    selected={feature.io}
                    className="dropdown-80"
                    buttonSize="btn-xs"
                />
            </td>
            <DeleteConfirmTableCell
                onDelete={deleteFeature}
                item={feature}
                buttonSize="btn-xs"
            />
        </tr>
    )
}

Feature.propTypes = {
    feature: PropTypes.shape({}).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
}

export default Feature
