import * as api from 'src/loudml/apis'
import {publishNotification} from 'shared/actions/notifications'
import {errorThrown} from 'shared/actions/errors'

export const getModel = modelName => async dispatch => {
  try {
    const {data: model} = await api.getModel(modelName)

    dispatch({
      type: 'LOAD_MODEL',
      payload: {model},
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchModels = () => async dispatch => {
  try {
    const {data: {models}} = await api.getModels()
    dispatch({type: 'LOAD_MODEL', payload: {models}})
  } catch (error) {
    dispatch(errorThrown(error))
  }
}

export const deleteModelSuccess = ruleID => ({
  type: 'DELETE_MODEL_SUCCESS',
  payload: {
    ruleID,
  },
})

export const updateRuleStatusSuccess = (ruleID, status) => ({
  type: 'UPDATE_RULE_STATUS_SUCCESS',
  payload: {
    ruleID,
    status,
  },
})

export const deleteModel = modelName => dispatch => {
  api
    .deleteModel(modelName)
    .then(() => {
      dispatch(deleteModelSuccess)
      dispatch(
        publishNotification('success', `${modelName} deleted successfully`)
      )
    })
    .catch(() => {
      dispatch(
        publishNotification('error', `${modelName} could not be deleted`)
      )
    })
}

export const updateModel = model => dispatch => {
  api
    .updateModel(model)
    .then(() => {
      dispatch(
        publishNotification('success', `${model.name} modified successfully`)
      )
    })
    .catch(() => {
      dispatch(
        publishNotification('error', `${model.name} could not be modified`)
      )
    })
}
