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
