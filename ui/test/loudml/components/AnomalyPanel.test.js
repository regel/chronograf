import React from 'react'
import AnomalyPanel from 'src/loudml/components/AnomalyPanel'
import OptIn from 'src/shared/components/OptIn';

import {mount} from 'enzyme'

// mock props
const model = {
    min_threshold: 0.5,
    max_threshold: 25,
    annotation: true,
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

    describe('user interactions', () => {
        describe('handle click on threshold label', () => {
            it('it calls onThresholdChange', () => {
                const onThresholdChange = jest.fn()
                const {wrapper} = setup({model, onThresholdChange})
      
                const minThreshold = wrapper.find(OptIn).filterWhere(n => n.prop('name') === 'min_threshold')
                minThreshold.find('.opt-in--label').simulate('click')
                
                expect(onThresholdChange).toHaveBeenCalledTimes(1)
                expect(onThresholdChange).toHaveBeenCalledWith('min_threshold', 0)
            })
        })      
    })

    describe('input validation', () => {
        const onThresholdChange = jest.fn()
        const {wrapper} = setup({model, onThresholdChange})

        const minThreshold = wrapper.find(OptIn).filterWhere(n => n.prop('name') === 'min_threshold')
        const input = minThreshold.find('input')
        input.simulate('focus')
        expect(onThresholdChange).toHaveBeenCalledTimes(1)
        
        describe('handle in range on threshold input', () => {
            it('it calls onThresholdChange with same value', () => {
                const value = '34'
      
                input.simulate('change', {target: {value}})

                expect(onThresholdChange).toHaveBeenLastCalledWith('min_threshold', Number.parseInt(value, 10))
            })
            it('it calls onThresholdChange with float value', () => {
                const value = '34.6'
      
                input.simulate('change', {target: {value}})

                expect(onThresholdChange).toHaveBeenLastCalledWith('min_threshold', Number.parseFloat(value))
            })
        })
        describe('handle out of range on threshold input', () => {
            it('it calls onThresholdChange with min value', () => {

                input.simulate('change', {target: {value: '-10'}})
                
                expect(onThresholdChange).toHaveBeenLastCalledWith('min_threshold', 0.1)
            })
            it('it calls onThresholdChange with max value', () => {

                input.simulate('change', {target: {value: '101'}})
                
                expect(onThresholdChange).toHaveBeenLastCalledWith('min_threshold', 100)
            })
        })
        describe('handle 0 on threshold input', () => {
            it('it calls onThresholdChange with 0', () => {

                input.simulate('change', {target: {value: '0'}})
                
                expect(onThresholdChange).toHaveBeenLastCalledWith('min_threshold', 0)
            })
        })
    })
})
