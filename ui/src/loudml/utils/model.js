import moment from 'moment'

export const normalizeInterval = bucketInterval => {
    // interval = max(5, min(bucketIntervak, 60))
    const regex = /(\d+)(.*)/
    const interval = regex.exec(bucketInterval)
    if (!interval||!interval.length) {
        return '5s'
    }

    try {
        const duration = moment.duration(Number.parseInt(interval[1], 10), interval[2]).asSeconds()
        const normalized = Math.max(
            5,
            moment.duration(
                Math.min(
                    duration,
                    60
                ),
                's'
            ).asSeconds()
        )
        return `${normalized}s`
    } catch (e) {
        console.error(`parsing interval ${bucketInterval} failed`, e)
        return '5s'
    }
}

export const normalizeSpan = bucketInterval => {
    // span = min(10, (2h/bucketInterval))
    const regex = /(\d+)(.*)/
    const interval = regex.exec(bucketInterval)
    if (!interval||!interval.length) {
        return 10
    }

    try {
        const duration = moment.duration(Number.parseInt(interval[1], 10), interval[2]).asSeconds()
        return Math.ceil(
            Math.min(
                10,
                moment.duration(
                    moment.duration(2, 'h').asSeconds()/duration,
                    's'
                ).asSeconds()
            )
        )
    } catch (e) {
        console.error(`parsing span ${bucketInterval} failed`, e)
        return 10
    }
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
