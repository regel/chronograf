const splitAddr = (addr, port) => {
    // extract host and port from url address
    const re = /(https?:)?(\/\/)?([\w\.]*):?(\d*)?/
    const res = re.exec(addr)
    return {
        host: res[3],
        port: res[4]||port,
    }
}

const equalAddr = (a, b) => ((a.host===b.host)&&(a.port===b.port))

export const findSource = (sources, bucket, port) => {
    const loudml = splitAddr(bucket.addr, port)

    return sources.find(s => {
        const sourceDb = splitAddr(s.url, port)
        return equalAddr(sourceDb, loudml)
    })
}
