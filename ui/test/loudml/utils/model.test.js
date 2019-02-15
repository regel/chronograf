import {
    normalizeInterval,
    normalizeSpan,
    MIN_INTERVAL_UNIT,
    MAX_INTERVAL_UNIT,
    MIN_SPAN,
    MAX_SPAN
} from 'src/loudml/utils/model'

describe('Loudml.Utils.Model', () => {
    describe('normalizeInterval', () => {
        // const MIN_INTERVAL = '5s'
        // const MAX_INTERVAL = '60s'

        it(`returns ${MIN_INTERVAL_UNIT} if no explicit interval`, () => {
            expect(normalizeInterval(null)).toEqual(MIN_INTERVAL_UNIT)
        })
        it(`returns ${MIN_INTERVAL_UNIT} if parsing interval failed`, () => {
            const interval = '5-'
            expect(normalizeInterval(interval)).toEqual(MIN_INTERVAL_UNIT)
        })
        it(`returns ${MAX_INTERVAL_UNIT} if interval greater than ${MAX_INTERVAL_UNIT}`, () => {
            const interval = '2m'
            expect(normalizeInterval(interval)).toEqual(MAX_INTERVAL_UNIT)
        })
        it(`returns interval if between ${MIN_INTERVAL_UNIT} and ${MAX_INTERVAL_UNIT}`, () => {
            const interval = '25s'
            expect(normalizeInterval(interval)).toEqual(interval)
        })
        it(`returns ${MIN_INTERVAL_UNIT} if interval less than ${MIN_INTERVAL_UNIT}`, () => {
            const interval = '4s'
            expect(normalizeInterval(interval)).toEqual(MIN_INTERVAL_UNIT)
        })
    })

    describe('normalizeSpan', () => {
        // const MIN_SPAN = 10
        const MIN_SPAN_THRESHOLD = '864s'
        const MAX_SPAN_THRESHOLD = '8640s'
        const SPAN_UNIT = '8000s'

        it(`returns ${MIN_SPAN} if no explicit interval`, () => {
            expect(normalizeSpan(null)).toEqual(MIN_SPAN)
        })
        it(`returns ${MIN_SPAN} if parsing interval failed`, () => {
            const interval = '5-'
            expect(normalizeSpan(interval)).toEqual(MIN_SPAN)
        })
        it(`returns ${MAX_SPAN} if interval less than ${MIN_SPAN_THRESHOLD}`, () => {
            const interval = '800s'
            expect(normalizeSpan(interval)).toEqual(MAX_SPAN)
        })
        it(`returns ${MIN_SPAN} if interval greater than ${MAX_SPAN_THRESHOLD}`, () => {
            const interval = '9000s'
            const normalized = normalizeSpan(interval)
            expect(normalized).toEqual(MIN_SPAN)
        })
        it(`returns interval if between ${MIN_SPAN_THRESHOLD} and ${MAX_SPAN_THRESHOLD}`, () => {
            const normalized = normalizeSpan(SPAN_UNIT)
            expect(normalized).toBeGreaterThanOrEqual(MIN_SPAN)
            expect(normalized).toBeLessThanOrEqual(MAX_SPAN)
        })
    })

})
