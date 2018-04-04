import {
  deleteModel,
  getModels as getModelsAJAX,
} from 'src/loudml/apis'
import {notify} from 'shared/actions/notifications'
import {errorThrown} from 'shared/actions/errors'
import {HTTP_NOT_FOUND} from 'shared/constants'
import {notifyServerError} from 'shared/copy/notifications'

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
export const removeAndLoadModels = modelName => async dispatch => {
  try {
    try {
      await deleteModel(modelName)
    } catch (err) {
      // A 404 means that either a concurrent write occurred or the model
      // passed to this action creator doesn't exist (or is undefined)
      if (err.status !== HTTP_NOT_FOUND) {
        // eslint-disable-line no-magic-numbers
        throw err
      }
    }

    const {data: newModels} = await getModelsAJAX()
    dispatch(loadModels(newModels))
  } catch (err) {
    dispatch(notify(notifyServerError()))
  }
}
