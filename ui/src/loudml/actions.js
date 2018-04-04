import {getModels as getModelsAJAX} from 'src/loudml/apis'
import {errorThrown} from 'shared/actions/errors'

export const addModel = model => ({
  type: 'LOUDML_MODEL_ADDED',
  payload: {
    model,
  },
})

export const loadModels = models => ({
  type: 'LOUDML_LOAD_MODELS',
  payload: models,
})

export const updateModel = model => ({
  type: 'LOUDML_MODEL_UPDATED',
  payload: {
    model,
  },
})

// async actions
export const loadModelsAsync = () => async dispatch => {
  try {
    const {data} = await getModelsAJAX()
    dispatch(loadModels(data))
  } catch (error) {
    dispatch(errorThrown(error))
  }
}
