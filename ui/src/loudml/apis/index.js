import AJAX from 'src/utils/ajax'

export const getModels = async () => {
  try {
    return await AJAX({
      method: 'GET',
      url: '/loudml/api/models',
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getModel = async name => {
  try {
    return await AJAX({
      method: 'GET',
      url: `/loudml/api/models/${name}`,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const createModel = async model => {
  try {
    return await AJAX({
      method: 'PUT',
      url: '/loudml/api/models',
      data: model,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateModel = async model => {
  try {
    return await AJAX({
      method: 'POST',
      url: `/loudml/api/models/${model.name}`,
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
      method: 'DELETE',
      url: `/loudml/api/models/${name}`,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getDatasources = async () => {
  try {
    return await AJAX({
      method: 'GET',
      url: '/loudml/api/datasources',
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
