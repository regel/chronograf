import React, {PropTypes} from 'react'
import classnames from 'classnames'

import Dropdown from 'shared/components/Dropdown'
import DeleteConfirmTableCell from 'shared/components/DeleteConfirmTableCell'

import {DEFAULT_METRICS} from 'src/loudml/constants'

const Feature = ({
  feature,
  onDelete,
  onEdit,
}) => {
  function deleteFeature() {
    onDelete(feature)
  }

  function handleCheckbox(name) {
    return (e) => onEdit(feature, {[name]: !feature[name]}) // eslint-disable-line no-unused-vars
  }

  function handleEdit(e) {
    let val = e.target.value
    const name = e.target.name

    switch (e.target.type) {
      case 'checkbox':
        val = e.target.checked
        break
      case 'number':
        val = Number(val)
        break
    }
    onEdit(feature, {[name]: val})
  }

  function handleMetricChoose(item) {
    onEdit(feature, {metric: item.text})
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
      <td style={{width: '100px'}}>
        <Dropdown
          name="metric"
          onChoose={handleMetricChoose}
          items={DEFAULT_METRICS.map(m => ({text: m}))}
          selected={feature.metric}
          className="dropdown-stretch"
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
        <div
          className={
            classnames('query-builder--list-item', {
              active: feature.input,
            })}
          onClick={handleCheckbox('input')}
          style={{backgroundColor: 'transparent'}}
        >
          <span>
            <div className="query-builder--checkbox" />
          </span>
        </div>
      </td>
      <td>
        <div
          className={
            classnames('query-builder--list-item', {
              active: feature.output,
            })}
          onClick={handleCheckbox('output')}
          style={{backgroundColor: 'transparent'}}
        >
          <span>
            <div className="query-builder--checkbox" />
          </span>
        </div>
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
