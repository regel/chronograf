import React from 'react'
import PropTypes from 'prop-types'

import NameSection from 'src/loudml/components/NameSection'
import DatasourceSection from 'src/loudml/components/DatasourceSection'

const GeneralPage = ({
    model,
    onInputChange,
    onDatasourceChoose,
    isCreating,
}) => {
    return (
        <div className="panel panel-solid">
            <div className="panel-heading">
                <h2 className="panel-title">
                </h2>
            </div>
            <div className="panel-body">
                <div className="form-group col-xs-12 col-sm-6">
                    <label>
                        {isCreating ? 'Name this model' : 'Name'}
                    </label>
                    <NameSection
                        modelName={model.name}
                        onEdit={onInputChange}
                        isCreating={isCreating}
                    />
                </div>
                <div className="form-group col-xs-12 col-sm-6">
                    <label>Data source</label>
                    <DatasourceSection
                        datasource={model.default_datasource}
                        onChoose={onDatasourceChoose}
                        buttonSize="btn-md"
                    />
                </div>
                <div className="form-group col-xs-12 col-sm-6">
                    <label htmlFor="max_evals">Max training iterations</label>
                    <input
                        type="number"
                        name="max_evals"
                        className="form-control input-md form-malachite"
                        value={model.max_evals}
                        onChange={onInputChange}
                        placeholder="ex: 100"
                    />
                </div>
            </div>
        </div>
    )
}

GeneralPage.propTypes = {
    model: PropTypes.shape({}),
    onDatasourceChoose: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
}

export default GeneralPage
