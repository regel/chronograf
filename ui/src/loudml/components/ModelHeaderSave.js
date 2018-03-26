import React, {PropTypes} from 'react'
import ReactTooltip from 'react-tooltip'
import SourceIndicator from 'shared/components/SourceIndicator'

const ModelHeaderSave = ({onSave, validationError}) =>
  <div className="page-header__right">
    <SourceIndicator />
    {validationError
      ? <button
          className="btn btn-success btn-sm disabled"
          data-for="save-model-tooltip"
          data-tip={validationError}
        >
          Save model
        </button>
      : <button className="btn btn-success btn-sm" onClick={onSave}>
          Save model
        </button>}
    <ReactTooltip
      id="save-model-tooltip"
      effect="solid"
      html={true}
      place="bottom"
      class="influx-tooltip model-tooltip"
    />
  </div>

const {func, string} = PropTypes

ModelHeaderSave.propTypes = {
  onSave: func.isRequired,
  validationError: string,
}

export default ModelHeaderSave
