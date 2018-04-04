import {FIVE_SECONDS, TEN_SECONDS, INFINITE} from 'shared/constants/index'

const notifySuccess = message => ({
  type: 'success',
  icon: 'checkmark',
  duration: FIVE_SECONDS,
  message,
})

const notifyError = (duration, message) => ({
  type: 'error',
  icon: 'alert-triangle',
  duration,
  message,
})

export const notifyErrorGettingModel = message => notifyError(
  TEN_SECONDS,
  `cannot get model: ${message}`,
)

export const notifyModelCreated = () => notifySuccess("model created")

export const notifyModelCreationFailed = (name, message) => notifyError(
  INFINITE,
  `cannot create '${name}' model: ${message}`,
)

export const notifyModelUpdated = () => notifySuccess("model updated")

export const notifyModelUpdateFailed = (name, message) => notifyError(
  INFINITE,
  `cannot update '${name}' model: ${message}`,
)
