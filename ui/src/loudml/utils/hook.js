export const createHook = (hook, bucket) => {
    const h = {...hook}
    h.config.bucket = bucket
    return h
}
