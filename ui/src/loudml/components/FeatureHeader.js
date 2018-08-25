import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {notify as notifyAction} from 'shared/actions/notifications'
import ConfirmButtons from 'shared/components/ConfirmButtons'
import DeleteConfirmButtons from '../../shared/components/DeleteConfirmButtons';

const FeatureHeader = ({
  feature,
  onEdit,
  // notify,
  onKeyDown,
  // onConfirm,
  onCancel,
  onDelete,
}) => {
  if (feature.isEditing) {
    return (
      <EditHeader
        feature={feature}
        onEdit={onEdit}
        onKeyDown={onKeyDown}
        // onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )
  }

  return (
    <Header
      feature={feature}
      onDelete={onDelete}
    />
  )
}

const Header = ({
    feature,
    onDelete,
}) => {

    return (
        <div className="db-manager-header">
            <h4>{feature.name}</h4>
            <div className="db-manager-header--actions text-right">
                <DeleteConfirmButtons
                    item={feature}
                    onDelete={onDelete}
                    // onCancel={onCancel}
                    buttonSize="btn-xs"
                />
            </div>
        </div>
    )
}

const EditHeader = ({
    feature,
    onEdit,
    onKeyDown,
    onConfirm,
    onCancel
}) => (
  <div className="db-manager-header db-manager-header--edit">
    <input
      className="form-control input-sm"
      name="name"
      type="text"
      value={feature.name}
      placeholder="Name this Database"
      onChange={onEdit(feature)}
      onKeyDown={onKeyDown(feature)}
      autoFocus={true}
      spellCheck={false}
      autoComplete={false}
    />
    <ConfirmButtons item={feature} onConfirm={onConfirm} onCancel={onCancel} />
  </div>
)

const {func, shape} = PropTypes

FeatureHeader.propTypes = {
  onEdit: func,
  notify: func.isRequired,
  feature: shape(),
  onKeyDown: func,
  onCancel: func,
  onDelete: func,
}

Header.propTypes = {
  notify: func.isRequired,
  onConfirm: func,
  onCancel: func,
  onDelete: func,
  feature: shape(),
}

EditHeader.propTypes = {
  feature: shape(),
  onEdit: func,
  onKeyDown: func,
  onCancel: func,
  onConfirm: func,
}

const mapDispatchToProps = dispatch => ({
  notify: message => dispatch(notifyAction(message)),
})

export default connect(null, mapDispatchToProps)(FeatureHeader)
