import React from 'react'
import OnOff from 'src/loudml/components/OnOff'

import {mount} from 'enzyme'

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
        onSetValue: () => {},
        ...override,
    }

    const wrapper = mount(<OnOff {...props} />)

    return {
        props,
        wrapper,
    }
}

describe('Components.Loudml.OnOff', () => {
    describe('rendering', () => {
        describe('initial render', () => {
            it('renders the <OnOff/> component', () => {
                const {wrapper} = setup()

                expect(wrapper.exists()).toBe(true)
            })

            it('renders off state', () => {
                const {wrapper} = setup()

                const value = wrapper.state('value')
                expect(value).toBe(false)

                const label = wrapper.find('.opt-in--label')
                expect(label.text()).toBe('off')
            })
        })

        describe('value render', () => {
            it('renders off state', () => {
                const {wrapper} = setup({value: false})

                const value = wrapper.state('value')
                expect(value).toBe(false)
            })

            it('renders on state', () => {
                const {wrapper} = setup({value: true})

                const value = wrapper.state('value')
                expect(value).toBe(true)
            })
        })

        describe('label render', () => {
            it('renders off state', () => {
                const {wrapper} = setup({value: false})

                const label = wrapper.find('.opt-in--label')
                expect(label.text()).toBe('off')
            })

            it('renders on state', () => {
                const {wrapper} = setup({value: true})

                const label = wrapper.find('.opt-in--label')
                expect(label.text()).toBe('on')
            })
        })

        describe('fixed label render', () => {
            it('renders off state', () => {
                const fixed = "I'm off"
                const {wrapper} = setup({
                    value: false,
                    fixedLabel: fixed,
                })

                const label = wrapper.find('.opt-in--label')
                expect(label.text()).toBe(fixed)
            })

            it('renders on state', () => {
                const fixed = "I'm on"
                const {wrapper} = setup({
                    value: true,
                    fixedLabel: fixed,
                })

                const label = wrapper.find('.opt-in--label')
                expect(label.text()).toBe(fixed)
            })
        })
    })

    describe('user interactions', () => {
        describe('handleClickToggle', () => {
            it('it calls onSetValue with new state', () => {
                const onSetValue = jest.fn()
                const {wrapper} = setup({onSetValue})
      
                const value = wrapper.state('value')
                expect(value).toBe(false)

                wrapper.find('.opt-in--groove-knob').simulate('click')
                const newValue = wrapper.state('value')

                expect(newValue).toBe(true)
                expect(onSetValue).toHaveBeenCalledTimes(1)
                expect(onSetValue).toHaveBeenCalledWith(newValue)

                const label = wrapper.find('.opt-in--label')
                expect(label.text()).toBe('on')
            })
        })      
    })
})
