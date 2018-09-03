import React from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs, TabPanel, TabPanels, TabList } from 'shared/components/Tabs'

import GeneralPanel from 'src/loudml/components/GeneralPanel'
import ParametersPanel from 'src/loudml/components/ParametersPanel'
import FeaturesPanel from 'src/loudml/components/FeaturesPanel'
import PredictionPanel from 'src/loudml/components/PredictionPanel'
import AnomalyPanel from 'src/loudml/components/AnomalyPanel'
// import InfoPanel from 'src/loudml/components/InfoPanel'

const ModelTabs = ({
    model,
    onDatasourceChoose,
    onInputChange,
    isCreating,
    annotation,
    onAnnotationChange,
    datasources,
    datasource,
    locked,
}) => {
    const tabs = [
        {
            type: 'General',
            component: (
                <GeneralPanel
                  model={model}
                  onDatasourceChoose={onDatasourceChoose}
                  onInputChange={onInputChange}
                  isCreating={isCreating}
                  datasources={datasources}
                />
            ),
        },
        {
            type: 'Parameters',
            component: (
                <ParametersPanel
                  model={model}
                  onInputChange={onInputChange}
                  locked={locked}
                />
            ),
        },
        {
            type: 'Features',
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
            type: 'Predictions',
            component: (
                <PredictionPanel
                    model={model}
                    onInputChange={onInputChange}
                />
            )
        },
        {
            type: 'Anomalies',
            component: (
                <AnomalyPanel
                    model={model}
                    annotation={annotation}
                    onInputChange={onInputChange}
                    onAnnotationChange={onAnnotationChange}
                />
            )
        },
/*        {
            type: 'Infos',
            component: (
                <InfoPanel
                    model={model}
                />
            )
        },*/
    ]

    return (
        <Tabs className="row">
            <TabList customClass="col-md-2 admin-tabs">
                {tabs.map((t, i) => <Tab key={tabs[i].type}>{tabs[i].type}</Tab>)}
            </TabList>
            <TabPanels customClass="col-md-10 admin-tabs--content">
                {tabs.map((t, i) => (
                    <TabPanel key={tabs[i].type}>{t.component}</TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    )
}

const {func, shape, bool, arrayOf} = PropTypes

ModelTabs.propTypes = {
    model: shape({}).isRequired,
    onDatasourceChoose: func.isRequired,
    onInputChange: func.isRequired,
    isCreating: bool.isRequired,
    annotation: bool.isRequired,
    onAnnotationChange: func.isRequired,
    datasources: arrayOf(shape()),
    datasource: shape(),
    locked: bool.isRequired,
}

export default ModelTabs
