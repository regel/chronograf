import React from 'react'
import Feature from 'src/loudml/components/Feature'

import { DEFAULT_FEATURE } from 'src/loudml/constants'

import {mount} from 'enzyme'

const badFeature = {
    ...DEFAULT_FEATURE,
    scores: 'unknown',
}

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
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
        describe('unknown values render', () => {
            it('renders the <Feature /> card', () => {
                const {wrapper} = setup({feature: badFeature})

                expect(wrapper.exists()).toBe(true)
            })
        })
    })
})
