import React, {PropTypes} from 'react'

import Dropdown from 'shared/components/Dropdown'

const DatasourceSection = ({
    datasource,
    datasources,
    onChoose,
    buttonSize,
}) => {
    function handleOnChoose(e) {
        onChoose(e.text)
    }

    if (!datasources) {
        return <p>No datasources</p>
    }

    return (
        <Dropdown
            name="default_datasource"
            items={datasources.map(ds => ({text: ds.name}))}
            onChoose={handleOnChoose}
            selected={datasource || ''}
            className="dropdown-stretch"
            buttonSize={buttonSize}
        />
    )
}

DatasourceSection.defaultProps = {
    datasources: [],
}

const {func, string, arrayOf, shape} = PropTypes

DatasourceSection.propTypes = {
    datasource: string,
    datasources: arrayOf(shape()).isRequired,
    onChoose: func,
    buttonSize: string,
}

export default DatasourceSection
