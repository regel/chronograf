import React from 'react'
import {TrainTimeJobButton} from 'src/loudml/components/TrainTimeJobButton'
import CustomTimeRange from 'src/loudml/components/CustomTimeRange';

import moment from 'moment'
import {mount} from 'enzyme'

import timeRangeDefaults from 'shared/data/timeRangeShortcuts'

const dateFormat = 'YYYY-MM-DD HH:mm'

const lower = moment().subtract(7, 'days').format(dateFormat)
const upper = moment().add(1, 'days').format(dateFormat)
const timeRange = {lower, upper}

// automate shallow render and providing new props
const setup = (override = {}) => {
    const props = {
        startLabel: 'Start',
        stopLabel: 'Stop',
        onStart: () => {},
        onStop: () => {},
        running: false,
        disabled: false,
        ...override,
    }
  
    const defaultState = {
    }
  
    const button = mount(<TrainTimeJobButton {...props} />)
  
    return {
        props,
        button,
        defaultState,
    }
}

describe('Components.Loudml.TrainTimeJobButton', () => {
    describe('rendering', () => {
        describe('initial render', () => {
            it('renders the <TrainTimeJobButton/> button', () => {
                const {button} = setup()

                expect(button.exists()).toBe(true)
            })

            it('does not show the <CustomTimeRange/> component', () => {
                const {button} = setup()

                const customTimeRange = button.find(CustomTimeRange)
                expect(customTimeRange.exists()).toBe(false)
            })
        })
    })

    describe('user interactions', () => {
        describe('click the <TrainTimeJobButton/> button', () => {
            it('shows the <CustomTimeRange/> when clicked', () => {
                const {button} = setup()
  
                const dropdown = button.find('div.dropdown-toggle')

                dropdown.simulate('click')
                const customTimeRange = button.find(CustomTimeRange)

                expect(customTimeRange.exists()).toBe(true)
            })
        })
        describe('training using 2 dates from the calendar', () => {
            it('apply the correct time when submitted', () => {
                const onStart = jest.fn()
                const {button} = setup({
                    timeRange,
                    onStart,
                })
  
                const dropdown = button.find('div.dropdown-toggle')
                dropdown.simulate('click')

                // click 'apply'
                const apply = button.find('div.custom-time--apply')
                apply.simulate('click')

                expect(onStart).toHaveBeenCalledWith({
                    lower: moment(lower).toISOString(),
                    upper: moment(upper).toISOString(),
                })
            })
        })
        describe('training using 1 date from the calendar, and \'now\'', () => {
            it('apply the correct time when submitted', () => {
                const onStart = jest.fn()
                const {button} = setup({
                    timeRange,
                    onStart,
                })
  
                const dropdown = button.find('div.dropdown-toggle')
                dropdown.simulate('click')

                // click 'now'
                const now = button.find('div.custom-time--now')
                now.simulate('click')

                // click 'apply'
                const apply = button.find('div.custom-time--apply')
                apply.simulate('click')

                expect(onStart).toHaveBeenCalledWith({
                    lower: moment(lower).toISOString(),
                    upper: 'now()',
                })
            })
        })
        describe('training using 1 shortcut, eg \'past week\'', () => {
            it('apply the correct time when submitted', () => {
                const onStart = jest.fn()
                const {button} = setup({
                    timeRange,
                    onStart,
                })
                
                const dropdown = button.find('div.dropdown-toggle')
                dropdown.simulate('click')
                
                const instance = button.find(CustomTimeRange).instance()
                const spy = jest.spyOn(instance, 'handleRefreshCals')
                instance.forceUpdate()
                
                // click 'next week'
                const index = timeRangeDefaults.findIndex(s => s.name === 'Past Week')
                const next = button.find('div.custom-time--shortcut').filterWhere(n => n.text() === timeRangeDefaults[index].name)
                
                next.simulate('click')

                expect(spy).toHaveBeenCalledTimes(1)
                const lowerDate = instance.lowerCal.getMoment()
                expect(moment().get('date') - lowerDate.get('date')).toBe(7)

                // click 'apply'
                const apply = button.find('div.custom-time--apply')
                apply.simulate('click')

                expect(onStart).toHaveBeenCalledTimes(1)
                spy.mockRestore()
            })
        })
    })
})
