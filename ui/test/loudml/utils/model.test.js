import {normalizeInterval, normalizeSpan} from 'src/loudml/utils/model'
import moment from 'moment'

describe('Loudml.Utils.Model', () => {
    describe('normalizeInterval', () => {
        const MIN_INTERVAL = '5s'
        const MAX_INTERVAL = '60s'

        it(`returns ${MIN_INTERVAL} if no explicit interval`, () => {
            expect(normalizeInterval(null)).toEqual(MIN_INTERVAL)
        })
        it(`returns ${MIN_INTERVAL} if parsing interval failed`, () => {
            const interval = '5-'
            expect(normalizeInterval(interval)).toEqual(MIN_INTERVAL)
        })
        it(`returns ${MAX_INTERVAL} if interval greater than ${MAX_INTERVAL}`, () => {
            const interval = '2m'
            expect(normalizeInterval(interval)).toEqual(MAX_INTERVAL)
        })
        it(`returns interval if between ${MIN_INTERVAL} and ${MAX_INTERVAL}`, () => {
            const interval = '25s'
            expect(normalizeInterval(interval)).toEqual(interval)
        })
        it(`returns ${MIN_INTERVAL} if interval less than ${MIN_INTERVAL}`, () => {
            const interval = '4s'
            expect(normalizeInterval(interval)).toEqual(MIN_INTERVAL)
        })
    })

    describe('normalizeSpan', () => {
        const MIN_SPAN = 10
        const SPAN_THRESHOLD = '12m'

        it(`returns ${MIN_SPAN} if no explicit interval`, () => {
            expect(normalizeSpan(null)).toEqual(MIN_SPAN)
        })
        it(`returns ${MIN_SPAN} if parsing interval failed`, () => {
            const interval = '5-'
            expect(normalizeSpan(interval)).toEqual(MIN_SPAN)
        })
        it(`returns ${MIN_SPAN} if interval less than ${SPAN_THRESHOLD}`, () => {
            const interval = '11m'
            expect(normalizeSpan(interval)).toEqual(MIN_SPAN)
        })
        it(`returns interval if interval greater than ${SPAN_THRESHOLD}`, () => {
            const interval = '13m'
            const normalized = normalizeSpan(interval)
            const expected = moment.duration(Number.parseInt(normalized, 10), 's').asSeconds()    // Math.ceil(9.23076923076923)
            expect(expected).toBeLessThanOrEqual(MIN_SPAN)
        })
    })

})
