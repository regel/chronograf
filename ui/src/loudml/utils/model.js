import moment from 'moment'

const MIN_INTERVAL_SECOND = 5
const MIN_INTERVAL_UNIT = `${MIN_INTERVAL_SECOND}s`
const MIN_SPAN = 10

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
            60
        )
    )
    return `${normalized}s`
}

export const normalizeSpan = bucketInterval => {
    // span = min(10, (2h/bucketInterval))
    const regex = /(\d+)(.*)/
    const interval = regex.exec(bucketInterval)
    if (!interval) {
        return MIN_SPAN
    }

    const duration = moment.duration(Number.parseInt(interval[1], 10), interval[2]).asSeconds()
    if (!duration) {
        return MIN_SPAN
    }

    return Math.ceil(
        Math.max(
            MIN_SPAN,
            7200/duration
        )
    )
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
