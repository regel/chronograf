import React, {PropTypes, Component} from 'react'
import ModelHeaderSave from 'src/loudml/components/ModelHeaderSave'

class ModelHeader extends Component {
  render() {
    const {source, onSave, validationError} = this.props

    return (
      <div className="page-header">
        <div className="page-header__container">
          <div className="page-header__left">
            <h1 className="page-header__title">Model creator</h1>
          </div>
          <ModelHeaderSave
            source={source}
            onSave={onSave}
            validationError={validationError}
          />
        </div>
      </div>
    )
  }
}

const {func, shape, string} = PropTypes

ModelHeader.propTypes = {
  source: shape({}).isRequired,
  onSave: func.isRequired,
  validationError: string,
}

export default ModelHeader
