import React, { SFC } from 'react'

import DatasourceSection from 'src/loudml/components/DatasourceSection'
import ModelTypeSection from 'src/loudml/components/ModelTypeSection';

import { Datasource } from 'src/loudml/types/datasource';
import { ModelSettings, ModelType } from 'src/loudml/types/model';
  
interface Props {
    model: ModelSettings
    onEdit: (field: string, value: string|number) => void
    onDropdownChoose: (e: any) => void
    datasources: Datasource[]
    modelTypes: ModelType[]
    locked: boolean
}

const GeneralPanel: SFC<Props> = ({
    model,
    onEdit,
    onDropdownChoose,
    datasources,
    modelTypes,
    locked,
}) => {
    function onInputChange(e) {
        const {name, value} = e.target

        onEdit(name, value)
    }

    return (
        <div className="panel panel-solid">
            <div className="panel-heading">
                <h2 className="panel-title" />
            </div>
            <div className="panel-body">
                <div className="form-group col-xs-4">
                    <label>Model type</label>
                    <div className="overlay-controls--tabs">
                        <ModelTypeSection
                            name="type"
                            type={model.type}
                            modelTypes={modelTypes}
                            onChoose={onDropdownChoose}
                            buttonSize="btn-md"
                            disabled={locked}
                            />
                    </div>
                </div>
                <div className="form-group col-xs-offset-2 col-xs-6">
                    <label>Data source</label>
                    <DatasourceSection
                        name="default_datasource"
                        datasource={model.default_datasource}
                        datasources={datasources}
                        onChoose={onDropdownChoose}
                        buttonSize="btn-md"
                        disabled={locked}
                    />
                </div>
                <div className="form-group col-xs-offset-6 col-xs-6">
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
                <div className="form-group col-xs-offset-6 col-xs-6">
                    <label>Data sink</label>
                    <DatasourceSection
                        name="default_datasink"
                        datasource={model.default_datasink}
                        datasources={datasources}
                        onChoose={onDropdownChoose}
                        buttonSize="btn-md"
                        />
                </div>
            </div>
        </div>
    )
}

export default GeneralPanel
