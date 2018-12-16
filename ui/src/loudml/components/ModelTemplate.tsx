import React, {Component} from 'react'

import PageHeader from 'src/reusable_ui/components/page_layout/PageHeader'
import FancyScrollbar from 'src/shared/components/FancyScrollbar'

import {ErrorHandling} from 'src/shared/decorators/errors'

import {
  Source,
} from 'src/types'
import TemplateNameSection from 'src/loudml/components/TemplateNameSection';
import { TemplateModel } from 'src/loudml/types/template';
import ModelHeaderSave from 'src/loudml/components/ModelHeaderSave';
import TemplateSelectorSection from 'src/loudml/components/TemplateSelectorSection';
import TemplateTagsSection from 'src/loudml/components/TemplateTagsSection';

interface Props {
  source: Source
  template: TemplateModel
  db: string
  measurement: string
  tagKey: string
  updateModelName: (name: string) => void
  onChooseTrigger: (trigger: string) => void
  updateTagsValues: (tags: string[]) => void
  handleSave: () => void
  validationError?: string
}

@ErrorHandling
class ModelTemplate extends Component<Props, null> {
  constructor(props) {
    super(props)
  }

  public render() {
    const {
      source,
      db,
      measurement,
      tagKey,
      updateModelName,
      onChooseTrigger,
      template,
      updateTagsValues,
    } = this.props

    return (
      <div className="page">
        <PageHeader
          titleText="Template Model Builder"
          optionsComponents={this.optionsComponents}
          sourceIndicator={true}
        />
        <FancyScrollbar className="page-contents fancy-scroll--kapacitor">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="rule-builder">
                  <TemplateNameSection
                    defaultName={template.name}
                    onModelRename={updateModelName}
                  />
                  <TemplateSelectorSection
                    template={template}
                    onChooseTrigger={onChooseTrigger}
                  />
                  <TemplateTagsSection
                    template={template}
                    source={source}
                    db={db}
                    measurement={measurement}
                    tagKey={tagKey}
                    onUpdateTags={updateTagsValues}
                  />
                </div>
              </div>
            </div>
          </div>
        </FancyScrollbar>
      </div>
    )
  }

  private get optionsComponents(): JSX.Element {
    const {handleSave, validationError, template} = this.props
    
    const label = (template.hosts.length>1?'Create models':'Create model')

    return (
      <ModelHeaderSave
        label={label}
        onSave={handleSave}
        validationError={validationError}
      />
    )
  }
}

export default ModelTemplate
