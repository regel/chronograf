import moment from 'moment'

const MIN_INTERVAL_SECOND = 5
export const MIN_INTERVAL_UNIT = `${MIN_INTERVAL_SECOND}s`
const MAX_INTERVAL_SECOND = 60
export const MAX_INTERVAL_UNIT = `${MAX_INTERVAL_SECOND}s`
export const MIN_SPAN = 10
export const MAX_SPAN = 100

export const normalizeInterval = bucketInterval => {
    // interval = max(5, min(bucketIntervak, 60))
    const regex = /(\d+)(.*)/
    const interval = regex.exec(bucketInterval)
    if (!interval) {
        return MIN_INTERVAL_UNIT
    }

    const duration = moment.duration(Number.parseInt(interval[1], 10), interval[2]).asSeconds()
    if (!duration) {
        return MIN_INTERVAL_UNIT
    }

    const normalized = Math.max(
        MIN_INTERVAL_SECOND,
        Math.min(
            duration,
            MAX_INTERVAL_SECOND
        )
    )
    return `${normalized}s`
}

export const normalizeSpan = bucketInterval => {
    // span = max(10, min(24h/bucketInterval, 100))
    const regex = /(\d+)(.*)/
    const interval = regex.exec(bucketInterval)
    if (!interval) {
        return MIN_SPAN
    }

    const duration = moment.duration(Number.parseInt(interval[1], 10), interval[2]).asSeconds()
    if (!duration) {
        return MIN_SPAN
    }

    return Math.max(MIN_SPAN, Math.min(Math.ceil(86400/duration), MAX_SPAN))
}

export const normalizeFeatureDefault = fill => {
    if (fill==='none'||fill==='null') {
        fill = null
    }
    // try to parse number
    const parsed = Number.parseFloat(fill)
    if (Number.isNaN(parsed)) {
        return fill
    }
    return parsed
}

export const denormalizeFeatureDefault = fill => {
    if (fill==='previous') {
        return fill
    }

    return `${fill}`
}
