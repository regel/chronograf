import React from 'react'
import ForecastTimeJobButton from 'src/loudml/components/ForecastTimeJobButton'
import CustomTimeJobButton from 'src/loudml/components/CustomTimeJobButton';
import CustomTimeRange from 'src/loudml/components/CustomTimeRange';

import {shallow, mount} from 'enzyme'

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
        startLabel: 'Start',
        stopLabel: 'Stop',
        onStart: () => {},
        onStop: () => {},
        running: false,
        disabled: false,
        // onChoose: jest.fn(),
        ...override,
    }
  
    const defaultState = {
    }
  
    const forecastTimeJobButton = mount(<ForecastTimeJobButton {...props} />)
  
    return {
        props,
        forecastTimeJobButton,
        defaultState,
    }
}

// beforeEach(mount)

describe('Components.Loudml.ForecastTimeJobButton', () => {
    describe('rendering', () => {
        describe('initial render', () => {
            it('renders the <ForecastTimeJobButton/> button', () => {
                const {forecastTimeJobButton} = setup()

                // expect(forecastTimeJobButton.exists()).toBe(true)

            })

/*             it('does not show the <CustomTimeRange/> component', () => {
                const {forecastTimeJobButton} = setup()

                const customTimeRange = forecastTimeJobButton.dive().find(CustomTimeRange)
                expect(customTimeRange.exists()).toBe(false)
            })
 */        })
    })

    describe('user interactions', () => {
        describe('click the <ForecastTimeJobButton/> button', () => {
            it('shows the <CustomTimeRange/> when clicked', () => {
                const {forecastTimeJobButton} = setup()
  
                const customTimeJobButton = forecastTimeJobButton.dive().find('div.dropdown')
                expect(customTimeJobButton.exists()).toBe(true)

                customTimeJobButton.simulate('click')
                // customTimeJobButton.update()

                // expect(customTimeJobButton.state().isCustomTimeRangeOpen).toBe(true)

                // const customTimeRange = customTimeJobButton.find(CustomTimeRange)
                // expect(customTimeRange.exists()).toBe(true)
            })
        })
    })
})
  