import React, {PropTypes} from 'react'

const FeatureTags = ({
    tags,
    // onDelete,
    // onEdit,
    // onAdd,
}) => (
    <div>
        <table className="table v-center">
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="admin-table--left-offset">Value</th>
                    <th/>
                </tr>
            </thead>
            <tbody>
                {tags&&tags.map((t, i) => (
                <tr key={i}>
                    <td>{t.tag}</td>
                    <td>{t.value}</td>
                    <td/>
                </tr>))}
            </tbody>
        </table>
    </div>
)

const {arrayOf, func, shape} = PropTypes

FeatureTags.propTypes = {
    tags: arrayOf(shape({})),
    onDelete: func,
    onEdit: func,
    onAdd: func,
}

export default FeatureTags
