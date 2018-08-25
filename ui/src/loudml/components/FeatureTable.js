import React, {PropTypes} from 'react'

import Feature from 'src/loudml/components/Feature'

const FeatureTable = ({
    feature,
    onDelete,
    onEdit
}) => (
    <div>
        <table className="table v-center table-highlight">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Measurement</th>
                    <th>Field</th>
                    <th>Metric</th>
                    <th>Default value</th>
                    <th>Input/Output</th>
                    <th className="admin-table--left-offset">Anomaly type</th>
                    <th/>
                </tr>
            </thead>
            <tbody>
                <Feature
                    feature={feature}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            </tbody>
        </table>
    </div>
)

const {func, shape} = PropTypes

FeatureTable.propTypes = {
    feature: shape({}).isRequired,
    onDelete: func.isRequired,
    onEdit: func.isRequired,
}

export default FeatureTable
