import React from 'react'
import TrainingStatus from 'src/loudml/components/TrainingStatus'

import {shallow} from 'enzyme'
import ProgressCode from 'src/loudml/components/ProgressCode';

const trainedState = { state: { trained: true } }
const notTrainedState = { state: { trained: false } }
const trainingWaitingStatus = { training: { state: 'waiting' } }
const trainingRunningStatus = { training: { state: 'running' } }
const trainingFailedStatus = { training: { state: 'failed' } }
const trainingDoneStatus = { training: { state: 'done' } }

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
        ...notTrainedState,
        ...override,
    }
  
    const wrapper = shallow(<TrainingStatus {...props} />)
  
    return {
        props,
        wrapper,
    }
}

describe('Components.Loudml.TrainingStatus', () => {
    describe('rendering', () => {
        describe('initial model render from state key', () => {
            it('renders the <TrainingStatus/>', () => {
                const {wrapper} = setup()

                expect(wrapper.exists()).toBe(true)
            })

            it('does not show the \'Trained\' label', () => {
                const {wrapper} = setup()

                const code = wrapper.find('code')
                expect(code.exists()).toBe(false)
            })
        })

        describe('trained model render from state key', () => {
            it('shows the \'Trained\' label', () => {
                const {wrapper} = setup(trainedState)

                const code = wrapper.find('code')
                expect(code.exists()).toBe(true)
                expect(code.text()).toBe('Trained.')
            })
        })

        describe('training waiting model render from training key', () => {
            it('shows the \'Training waiting\' label', () => {
                const {wrapper} = setup(trainingWaitingStatus)

                const code = wrapper.find('code')
                expect(code.exists()).toBe(true)
                expect(code.text()).toBe('Training\u00a0waiting.')
            })
        })

        describe('training model render from training key', () => {
            it('shows the <ProgressCode/> component', () => {
                const {wrapper} = setup(trainingRunningStatus)

                const code = wrapper.find(ProgressCode)
                expect(code.exists()).toBe(true)
            })
        })

        describe('training failed model render from training key', () => {
            it('shows the \'Training failed\' label', () => {
                const {wrapper} = setup(trainingFailedStatus)

                const code = wrapper.find('code')
                expect(code.exists()).toBe(true)
                expect(code.text()).toBe('Training\u00a0failed.')
            })
        })

        describe('training done model render from training key', () => {
            it('shows the \'Trained\' label', () => {
                const {wrapper} = setup(trainingDoneStatus)

                const code = wrapper.find('code')
                expect(code.exists()).toBe(true)
                expect(code.text()).toBe('Trained.')
            })
        })
    })

})
