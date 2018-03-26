import AJAX from 'utils/ajax'

export const getModels = async () => {
  try {
    return await AJAX({
      url: '/loudml/api/models',
      excludeBasepath: true,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
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

export const createModel = async model => {
  try {
    console.error(model)
    return await AJAX({
      url: '/loudml/api/models',
      excludeBasepath: true,
      method: 'PUT',
      data: model,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateModel = async model => {
  try {
    console.error(model)
    return await AJAX({
      url: `/loudml/api/models/${model.name}`,
      excludeBasepath: true,
      method: 'POST',
      data: model,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteModel = async name => {
  try {
    return await AJAX({
      url: `/loudml/api/models/${name}`,
      excludeBasepath: true,
      method: 'DELETE',
    })
  } catch (error) {
    console.error(error)
    throw error
  }
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

export const train = async (name, from, to) => {
  try {
    return await AJAX({
      method: 'POST',
      url: `/loudml/api/models/${name}/_train`,
      params: {from, to},
      excludeBasepath: true,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const start = async name => {
  try {
    return await AJAX({
      method: 'POST',
      url: `/loudml/api/models/${name}/_start`,
      params: {save_prediction: true},
      excludeBasepath: true,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
