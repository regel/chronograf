import React, { SFC } from 'react'

import { ModelSettings } from 'src/loudml/types/model'
import LockablePanel from 'src/loudml/components/LockablePanel'
import { Dropdown } from 'src/shared/components/Dropdown';

interface Props {
    model: ModelSettings
    onEdit: (field: string, value: string|number) => void
    keys: string[]
    locked: boolean
}

const FingerprintsPanel: SFC<Props> = ({
    model,
    onEdit,
    keys,
    locked,
}) => {
    function onInputChange(e) {
        const {name, value} = e.target

        onEdit(name, value)
    }

    function handleChoose(key) {

        return (item) => {
            onEdit(key, item.text)
        }
    }

    return (
        <LockablePanel locked={locked}>
            <div className="panel-body">
                <div className="form-group col-sm-4">
                    <label htmlFor="bucket_interval">groupBy bucket interval</label>
                    <input
                        type="text"
                        name="bucket_interval"
                        className="form-control input-md form-malachite"
                        value={model.bucket_interval}
                        onChange={onInputChange}
                        placeholder="ex: 30s, 20m, 1h, 1d, ..."
                        disabled={locked}
                    />
                </div>
                <div className="form-group col-sm-offset-2 col-sm-4">
                    <label htmlFor="modelWidth">Width</label>
                    <input
                        type="number"
                        name="modelWidth"
                        className="form-control input-md form-malachite"
                        value={model.width}
                        onChange={onInputChange}
                        placeholder="ex: 100"
                        disabled={locked}
                        />
                </div>
                <div className="form-group col-sm-4">
                    <label htmlFor="modelKey">Key</label>
                    <Dropdown
                        name="modelKey"
                        onChoose={handleChoose('key')}
                        items={keys.map(k => ({text: k}))}
                        selected={keys.find(k => k === model.key)||''}
                        useAutoComplete={true}
                        className="dropdown-stretch"
                        buttonSize="btn-sm"
                        disabled={locked}
                        />
                </div>
                <div className="form-group col-sm-offset-2 col-sm-4">
                    <label htmlFor="modelHeight">Height</label>
                    <input
                        type="number"
                        name="modelHeight"
                        className="form-control input-md form-malachite"
                        value={model.height}
                        onChange={onInputChange}
                        placeholder="ex: 100"
                        disabled={locked}
                    />
                </div>
            </div>
        </LockablePanel>
    )
}

export default FingerprintsPanel
