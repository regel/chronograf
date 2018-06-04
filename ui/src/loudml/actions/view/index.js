import {
  MODELS_LOADED,
  MODEL_DELETED,
  MODEL_CREATED,
  MODEL_UPDATED,
  START_JOB,
  STOP_JOB,
  UPDATE_JOBS,
} from 'src/loudml/constants'

/*
export const getModel = modelName => async dispatch => {
  try {
    const {data: model} = await api.getModel(modelName)

    dispatch({
      type: 'LOAD_MODELS',
      payload: {model},
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
*/

export function modelsLoaded(models) {
  return {
    type: MODELS_LOADED,
    payload: models
  }
}

export const modelDeleted = name => ({
  type: MODEL_DELETED,
  payload: name
})

export const modelCreated = model => ({
  type: MODEL_CREATED,
  payload: model
})

export const modelUpdated = model => ({
  type: MODEL_UPDATED,
  payload: model
})

export const jobStart = job => ({
  type: START_JOB,
  payload: job
})

export const jobStop = job => ({
  type: STOP_JOB,
  payload: job
})

export const jobsUpdate = jobs => ({
  type: UPDATE_JOBS,
  payload: jobs
})

export const updateRuleStatusSuccess = (ruleID, status) => ({
  type: 'UPDATE_RULE_STATUS_SUCCESS',
  payload: {
    ruleID,
    status,
  },
})
