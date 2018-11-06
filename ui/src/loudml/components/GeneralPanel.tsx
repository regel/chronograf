import React, { SFC } from 'react'

import DatasourceSection from 'src/loudml/components/DatasourceSection'

import { Datasource } from 'src/loudml/types/datasource';
import { ModelSettings } from 'src/loudml/types/model';
import RadioButtons from 'src/reusable_ui/components/radio_buttons/RadioButtons';
import { ButtonShape, ComponentSize } from 'src/reusable_ui/types';

const enum ModelTypeTabs {
    Timeseries = 'timeseries',
    Fingerprints = 'fingerprints',
}
  
interface Props {
    model: ModelSettings
    onEdit: (field: string, value: string|number) => void
    onDatasourceChoose: (e: any) => void
    datasources: Datasource[]
    locked: boolean
}

const GeneralPanel: SFC<Props> = ({
    model,
    onEdit,
    onDatasourceChoose,
    datasources,
    locked,
}) => {
    function onSetActiveTypeTab(name) {
        onEdit('type', name)
    }

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
                        <RadioButtons
                            activeButton={model.type}
                            buttons={[ModelTypeTabs.Timeseries, ModelTypeTabs.Fingerprints]}
                            onChange={onSetActiveTypeTab}
                            shape={ButtonShape.StretchToFit}
                            size={ComponentSize.Medium}
                            // disabled={true}
                            />
                    </div>
                </div>
                <div className="form-group col-xs-offset-2 col-xs-6">
                    <label>Data source</label>
                    <DatasourceSection
                        datasource={model.default_datasource}
                        datasources={datasources}
                        onChoose={onDatasourceChoose}
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
            </div>
        </div>
    )
}

export default GeneralPanel
