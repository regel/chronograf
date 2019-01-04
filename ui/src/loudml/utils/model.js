import moment from 'moment'

export const normalizeInterval = bucketInterval => {
    const regex = /(\d+)(.*)/
    const interval = regex.exec(bucketInterval)
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
}

export const normalizeSpan = bucketInterval => {
    // span = min(10, (2h/bucketInterval))
    const regex = /(\d+)(.*)/
    const interval = regex.exec(bucketInterval)

    try {
        const duration = moment.duration(Number.parseInt(interval[1], 10), interval[2]).asSeconds()
        return Math.ceil(
            Math.max(
                10, moment.duration(2, 'h').asSeconds()/duration
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
