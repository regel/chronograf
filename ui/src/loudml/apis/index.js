import AJAX from 'utils/ajax'

const splitAddr = (url, port) => {
    // extract host and port from url address
    const re = /(https?:)?(\/\/)?([\w\.]*):?(\d*)?/
    const res = re.exec(url)
    return {
        host: res[3],
        port: res[4]||port,
    }
}

const DEFAULT_START_OPTIONS = {
    output_bucket: 'loudml',
    save_output_data: true,
    flag_abnormal_data: true,
}

export const getVersion = () => AJAX({
        url: '/loudml/api/',
        excludeBasepath: true,
    })

export const getBuckets = () => AJAX({
        url: '/loudml/api/buckets',
        excludeBasepath: true,
    })

export const getModels = (names?: string[]) => {
    if (Array.isArray(names) && names.length > 0) {
        const ids = names.join(';')
        return AJAX({
            url: `/loudml/api/models/${ids}`,
            excludeBasepath: true,
        })
    }
    return AJAX({
        url: '/loudml/api/models',
        excludeBasepath: true,
    })
}

export const getJobs = (names?: string[]) => {
    if (Array.isArray(names) && names.length > 0) {
        const ids = names.join(';')
        return AJAX({
            url: `/loudml/api/jobs/${ids}`,
            excludeBasepath: true,
        })
    }
    return AJAX({
        url: '/loudml/api/jobs',
        excludeBasepath: true,
    })
}

export const getJob = id => AJAX({
        url: `/loudml/api/jobs/${id}`,
        excludeBasepath: true,
    })

export const getModel = async name => {
    try {
        return await AJAX({
            url: `/loudml/api/models/${name}`,
            excludeBasepath: true,
        })
    } catch (error) {
        throw error
    }
}

export const createModel = model => AJAX({
        url: '/loudml/api/models',
        excludeBasepath: true,
        method: 'POST',
        data: model,
    })

export const updateModel = model => AJAX({
        url: `/loudml/api/models/${model.name}`,
        excludeBasepath: true,
        method: 'PATCH',
        data: model,
    })

export const deleteModel = name => AJAX({
        url: `/loudml/api/models/${name}`,
        excludeBasepath: true,
        method: 'DELETE',
    })

export const createAndGetBucket = async (database, retentionPolicy, measurement, source) => {
    try {
        const {host, port} = splitAddr(source.url, 8086)
        const bucketName = [
            database,
            retentionPolicy,
        ].join('_')
        const settings = {
            type: 'influxdb',
            name: bucketName,
            retention_policy: retentionPolicy,
            database,
            addr: `${host}:${port}`,
            dbuser: source.username,
            dbuser_password: source.password,
            verify_ssl: !source.insecureSkipVerify,
            use_ssl: source.url.startsWith('https'),
        }
        await AJAX({
            url: '/loudml/api/buckets',
            excludeBasepath: true,
            method: 'POST',
            data: settings,
        })
        const response = await AJAX({
            url: `/loudml/api/buckets/${bucketName}`,
            excludeBasepath: true,
        })
        return response.data[0]
    } catch (error) {
        throw error
    }
}

export const trainModel = (name, from, to) => AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_train`,
        params: {from, to},
        excludeBasepath: true,
    })

export const trainAndStartModel = (name, from, to) => AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_train`,
        params: {
            from,
            to,
            ...DEFAULT_START_OPTIONS,
        },
        excludeBasepath: true,
    })

export const forecastModel = (name, from, to) => AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_forecast`,
        params: {
            from,
            to,
            save_output_data: true,
            output_bucket: 'loudml',
            bg: true,
        },
        excludeBasepath: true,
    })

export const startModel = name => AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_start`,
        params: {
            ...DEFAULT_START_OPTIONS,
        },
        excludeBasepath: true,
    })

export const stopModel = name => AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_stop`,
        excludeBasepath: true,
    })

export const stopJob = id => AJAX({
        method: 'POST',
        url: `/loudml/api/jobs/${id}/_cancel`,
        excludeBasepath: true,
    })

export const getModelHooks = name => AJAX({
        url: `/loudml/api/models/${name}/hooks`,
        excludeBasepath: true,
    })

export const createModelHook = (name, hook) => AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/hooks`,
        data: hook,
        excludeBasepath: true,
    })

export const deleteModelHook = (name, hookName) => AJAX({
        method: 'DELETE',
        url: `/loudml/api/models/${name}/hooks/${hookName}`,
        excludeBasepath: true,
    })
