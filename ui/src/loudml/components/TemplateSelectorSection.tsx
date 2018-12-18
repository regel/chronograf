import React, {SFC} from 'react'

import { TemplateModel } from 'src/loudml/types/template';
import { ButtonShape, ComponentSize } from 'src/reusable_ui/types';
import RadioButtons from 'src/reusable_ui/components/radio_buttons/RadioButtons';

const enum TemplateTypeTabs {
  Syslog = 'syslog',
  Other = 'other',
}

interface Props {
  template: TemplateModel
  onChooseTrigger: (trigger: string) => void
}

const TemplateSelectorSection: SFC<Props> = ({
  template,
  onChooseTrigger,
}) => (
    <div className="rule-section">
      <h3 className="rule-section--heading">Choose a template</h3>
      <div className="rule-section--body">
        <div className="rule-section--row rule-section--row-first rule-section--row-last">
          <RadioButtons
            activeButton={template.trigger}
            buttons={[TemplateTypeTabs.Syslog, TemplateTypeTabs.Other]}
            onChange={onChooseTrigger}
            shape={ButtonShape.Default}
            size={ComponentSize.Small}
            disabled={true}
            />
        </div>
      </div>
    </div>
)

export default TemplateSelectorSection
