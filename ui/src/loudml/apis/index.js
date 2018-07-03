import AJAX from 'utils/ajax'

export const getModels = () => {
    return AJAX({
        url: '/loudml/api/models',
        excludeBasepath: true,
    })
}

export const getJobs = () => {
    return AJAX({
        url: '/loudml/api/jobs',
        excludeBasepath: true,
    })
}

export const getJob = id => {
    return AJAX({
        url: `/loudml/api/jobs/${id}`,
        excludeBasepath: true,
    })
}

export const getModel = async name => {
    try {
        return await AJAX({
            url: `/loudml/api/models/${name}`,
            excludeBasepath: true,
        })
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createModel = model => {
    return AJAX({
        url: '/loudml/api/models',
        excludeBasepath: true,
        method: 'PUT',
        data: model,
    })
}

export const updateModel = model => {
    return AJAX({
        url: `/loudml/api/models/${model.name}`,
        excludeBasepath: true,
        method: 'POST',
        data: model,
    })
}

export const deleteModel = name => {
    return AJAX({
        url: `/loudml/api/models/${name}`,
        excludeBasepath: true,
        method: 'DELETE',
    })
}

export const getDatasources = async () => {
    try {
        return await AJAX({
            url: '/loudml/api/datasources',
            excludeBasepath: true,
        })
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const trainModel = (name, from, to) => {
    return AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_train`,
        params: {from, to},
        excludeBasepath: true,
    })
}

export const forecastModel = (name, from, to) => {
    return AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_forecast`,
        params: {
            from,
            to,
            save_prediction: true},
        excludeBasepath: true,
    })
}

export const startModel = name => {
    return AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_start`,
        params: {
            save_prediction: true,
            detect_anomalies: true,
        },
        excludeBasepath: true,
    })
}

export const stopModel = name => {
    return AJAX({
        method: 'POST',
        url: `/loudml/api/models/${name}/_stop`,
        // params: {save_prediction: true},
        excludeBasepath: true,
    })
}

export const stopJob = id => {
    return AJAX({
        method: 'POST',
        url: `/loudml/api/jobs/${id}/_cancel`,
        excludeBasepath: true,
    })
}
