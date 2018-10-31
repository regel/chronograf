import React from 'react'
import {CustomTimeJobButton} from 'src/loudml/components/CustomTimeJobButton';
import CustomTimeRange from 'src/loudml/components/CustomTimeRange';
import ConfirmButton from 'src/shared/components/ConfirmButton'

import {shallow} from 'enzyme'

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
        startLabel: 'Start',
        stopLabel: 'Stop',
        onStart: () => {},
        onStop: () => {},
        // running: false,
        // disabled: false,
        // onChoose: jest.fn(),
        ...override,
    }
  
    const defaultState = {
    }
  
    const button = shallow(<CustomTimeJobButton {...props} />)
  
    return {
        props,
        button,
        defaultState,
    }
}

describe('Components.Loudml.CustomTimeJobButton', () => {
    describe('rendering', () => {
        describe('initial render', () => {
            it('renders the <CustomTimeJobButton/> button', () => {
                const {button} = setup()

                expect(button.exists()).toBe(true)
            })

            it('does not show the <CustomTimeRange/> component', () => {
                const {button} = setup()

                const customTimeRange = button.find(CustomTimeRange)
                expect(customTimeRange.exists()).toBe(false)
            })
        })

        describe('when running', () => {
            it('renders the <ConfirmButton/> button', () => {
                const {button} = setup({running: true})

                const confirmButton = button.find(ConfirmButton)
                expect(confirmButton.exists()).toBe(true)
            })

            it('does not show the <CustomTimeRange/> component', () => {
                const {button} = setup({running: true})

                const customTimeRange = button.find(CustomTimeRange)
                expect(customTimeRange.exists()).toBe(false)
            })
        })
    })

    describe('user interactions', () => {
        describe('click the <CustomTimeJobButton/> button', () => {
            it('shows the <CustomTimeRange/> when clicked', () => {
                const {button} = setup()
  
                const dropdown = button.find('div.dropdown-toggle')
                dropdown.simulate('click')

                const customTimeRange = button.find(CustomTimeRange)
                expect(customTimeRange.exists()).toBe(true)
            })
        })
    })
})
  