import React from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs, TabPanel, TabPanels, TabList } from 'shared/components/Tabs'

import GeneralPanel from 'src/loudml/components/GeneralPanel'
import ParametersPanel from 'src/loudml/components/ParametersPanel'
import FeaturesPanel from 'src/loudml/components/FeaturesPanel'
import PredictionPanel from 'src/loudml/components/PredictionPanel'

const ModelTabs = ({
    model,
    // source,
    // onSave,
    // onTrain,
    // onStart,
    onDatasourceChoose,
    onInputChange,
    isCreating,
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
                />
            ),
        },
        {
            type: 'Parameters',
            component: (
                <ParametersPanel
                  model={model}
                  onInputChange={onInputChange}
                />
            ),
        },
        {
            type: 'Features',
            component: (
                <FeaturesPanel
                    features={model.features}
                    onInputChange={onInputChange}
                />
            ),
        },
        {
            type: 'Prediction',
            component: (
                <PredictionPanel
                    model={model}
                    onInputChange={onInputChange}
                />
            )
        }
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

ModelTabs.propTypes = {
    model: PropTypes.shape({}).isRequired,
    onDatasourceChoose: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
}

export default ModelTabs
