import React from 'react'
import PropTypes from 'prop-types'
import SubSections from 'src/shared/components/SubSections'

import GeneralPanel from 'src/loudml/components/GeneralPanel'
import ParametersPanel from 'src/loudml/components/ParametersPanel'
import FeaturesPanel from 'src/loudml/components/FeaturesPanel'
import PredictionPanel from 'src/loudml/components/PredictionPanel'
import AnomalyPanel from 'src/loudml/components/AnomalyPanel'

const ModelTabs = ({
    sourceID,
    tab,
    model,
    onDatasourceChoose,
    onInputChange,
    isEditing,
    annotation,
    onAnnotationChange,
    datasources,
    datasource,
    locked,
}) => {
    const sections = [
        {
            url: 'general',
            name: 'General',
            enabled: true,
            component: (
                <GeneralPanel
                    model={model}
                    onDatasourceChoose={onDatasourceChoose}
                    onInputChange={onInputChange}
                    isEditing={isEditing}
                    datasources={datasources}
                    locked={locked}
                    />
            ),
        },
        {
            url: 'parameters',
            name: 'Parameters',
            enabled: true,
            component: (
                <ParametersPanel
                    model={model}
                    onInputChange={onInputChange}
                    locked={locked}
                    />
            ),
        },
        {
            url: 'features',
            name: 'Features',
            enabled: true,
            component: (
                <FeaturesPanel
                    features={model.features}
                    onInputChange={onInputChange}
                    datasource={datasource}
                    locked={locked}
                />
            ),
        },
        {
            url: 'predictions',
            name: 'Predictions',
            enabled: true,
            component: (
                <PredictionPanel
                    model={model}
                    onInputChange={onInputChange}
                />
            )
        },
        {
            url: 'anomalies',
            name: 'Anomalies',
            enabled: true,
            component: (
                <AnomalyPanel
                    model={model}
                    annotation={annotation}
                    onInputChange={onInputChange}
                    onAnnotationChange={onAnnotationChange}
                />
            )
        },
    ]

    return (
        <SubSections
            parentUrl={`loudml/models/${model.name}`}
            sourceID={sourceID}
            activeSection={tab}
            sections={sections}
        />
    )
}

const {func, shape, bool, arrayOf, string} = PropTypes

ModelTabs.propTypes = {
    tab: string,
    sourceID: string,
    model: shape({}).isRequired,
    onDatasourceChoose: func.isRequired,
    onInputChange: func.isRequired,
    isEditing: bool.isRequired,
    annotation: bool.isRequired,
    onAnnotationChange: func.isRequired,
    datasources: arrayOf(shape()),
    datasource: shape(),
    locked: bool.isRequired,
}

export default ModelTabs
