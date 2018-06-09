import React, {PropTypes} from 'react'

import Feature from 'src/loudml/components/Feature'

const FeaturesTable = ({features, onDelete, onEdit}) => (
    <table className="table v-center table-highlight">
        <thead>
            <tr>
                <th>Name</th>
                <th>Measurement</th>
                <th>Field</th>
                <th>Metric</th>
                <th>Default value</th>
                <th className="admin-table--left-offset">I/O</th>
                <th/>
            </tr>
        </thead>
        <tbody>
            {features.map((feature, index) =>
                <Feature
                    key={index}
                    feature={feature}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            )}
        </tbody>
    </table>
)

FeaturesTable.propTypes = {
    features: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
}

export default FeaturesTable
