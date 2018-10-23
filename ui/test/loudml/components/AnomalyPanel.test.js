import React from 'react'

import AnomalyPanel from 'src/loudml/components/AnomalyPanel'
import OptIn from 'src/shared/components/OptIn';
import OnOff from 'src/loudml/components/OnOff';

import {mount} from 'enzyme'

// mock props
const model = {
    min_threshold: 0.5,
    max_threshold: 25,
}

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
        model: {},
        annotation: false,
        onAnnotationChange: () => {},
        onThresholdChange: () => {},
        ...override,
    }

    const wrapper = mount(<AnomalyPanel {...props} />)

    return {
        props,
        wrapper,
    }
}

describe('Components.Loudml.AnomalyPanel', () => {
    describe('rendering', () => {
        describe('initial render', () => {
            it('renders the <AnomalyPanel/> component with empty model', () => {
                const {wrapper} = setup()

                expect(wrapper.exists()).toBe(true)
            })

            it('renders the <AnomalyPanel/> component with a model', () => {
                const {wrapper} = setup({model})

                expect(wrapper.exists()).toBe(true)
            })
        })
    })

    describe('threshold user interactions', () => {
        const onThresholdChange = jest.fn()
        const {wrapper} = setup({model, onThresholdChange})
        const minThreshold = wrapper.find(OptIn).filterWhere(n => n.prop('name') === 'min_threshold')

        describe('handle click on threshold label', () => {
            it('it calls onThresholdChange with default value', () => {
                minThreshold.find('.opt-in--label').simulate('click')
                
                expect(onThresholdChange).toHaveBeenLastCalledWith('min_threshold', "0")
            })
        })      
        describe('handle change on threshold input', () => {
            it('it calls onThresholdChange with same value', () => {
                const input = minThreshold.find('input')
                input.simulate('focus')
        
                const value = '34'
      
                input.simulate('change', {target: {value}})

                expect(onThresholdChange).toHaveBeenLastCalledWith('min_threshold', value)
            })
        })
    })

    describe('annotation user interactions', () => {
        const onAnnotationChange = jest.fn()
        const {wrapper, props} = setup({onAnnotationChange})
        const annotation = wrapper.find(OnOff)

        describe('handle click on knob', () => {
            it('it calls onAnnotationChange with NOT value', () => {
                annotation.find('.opt-in--groove-knob').simulate('click')
                
                expect(onAnnotationChange).toHaveBeenLastCalledWith(!props.annotation)
            })
        })
    })
})
