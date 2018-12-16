import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import classnames from 'classnames'

const ModelHeaderSave = ({
    onSave,
    label='Save model',
    validationError=''
}) => {
    return (
        <div className="page-header__right">
            <div className={classnames('btn', 'btn-sm', 'btn-success', {
                'disabled': validationError,
                })}
                onClick={onSave}
                data-for="save-model-tooltip"
                data-tip={validationError}>
                {label}
                <ReactTooltip
                    id="save-model-tooltip"
                    effect="solid"
                    html={true}
                    place="left"
                    class="influx-tooltip model-tooltip"
                    />
            </div>
        </div>
    )
}

const {func, string} = PropTypes

ModelHeaderSave.propTypes = {
    onSave: func.isRequired,
    validationError: string,
    label: string,
}

export default ModelHeaderSave
