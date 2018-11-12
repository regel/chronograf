import React from 'react'
import Feature from 'src/loudml/components/Feature'

import { DEFAULT_FEATURE, DEFAULT_SCORES, DEFAULT_TRANSFORM } from 'src/loudml/constants'
import {Dropdown} from 'src/shared/components/Dropdown'

import {mount} from 'enzyme'

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
        timeseries: true,
        feature: {...DEFAULT_FEATURE},
        onDelete: () => {},
        onEdit: () => {},
        onKeyDown: () => {},
        onConfirm: () => {},
        measurements: [],
        source: {},
        database: '',
        locked: false,
        ...override,
    }
  
    const defaultState = {
    }
  
    const wrapper = mount(<Feature {...props} />)
  
    return {
        props,
        wrapper,
        defaultState,
    }
}

describe('Components.Loudml.Feature', () => {
    describe('rendering', () => {
        describe('initial render', () => {
            it('renders the <Feature /> card', () => {
                const {wrapper} = setup()

                expect(wrapper.exists()).toBe(true)
            })
        })
    })
    describe('user interactions', () => {
        describe('change Scores value', () => {
            it('set new scores value', () => {
                const score = DEFAULT_SCORES.find(s => s.text === 'standardize')
                const onEdit = jest.fn()
                const {
                    wrapper,
                    props: {
                        feature
                    }
                } = setup({
                    onEdit,
                })
                
                const dropdown = wrapper.find(Dropdown).filterWhere(n => n.prop('name') === 'scores')
                dropdown.simulate('click')

                const item = wrapper.find('a').filterWhere(n => n.text() === score.text)
                item.simulate('click')

                expect(onEdit).toHaveBeenCalledTimes(1)
                expect(onEdit).toHaveBeenLastCalledWith(
                    feature,
                    {scores: score.value}
                )
            })
        })
        describe('change Transform value', () => {
            it('set new transform value', () => {
                const transform = DEFAULT_TRANSFORM.find(s => s.text === 'diff')
                const onEdit = jest.fn()
                const {
                    wrapper,
                    props: {
                        feature
                    }
                } = setup({
                    onEdit,
                })
                
                const dropdown = wrapper.find(Dropdown).filterWhere(n => n.prop('name') === 'transform')
                dropdown.simulate('click')

                const item = wrapper.find('a').filterWhere(n => n.text() === transform.text)
                item.simulate('click')

                expect(onEdit).toHaveBeenCalledTimes(1)
                expect(onEdit).toHaveBeenLastCalledWith(
                    feature,
                    {transform: transform.value}
                )
            })
        })
    })
})
