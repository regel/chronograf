import {getModels as getModelsAJAX} from 'src/loudml/apis'
import {errorThrown} from 'shared/actions/errors'

export const loadModels = ({models}) => ({
  type: 'LOUDML_LOAD_MODELS',
  payload: {
    models,
  },
})

// async actions
export const loadModelsAsync = () => async dispatch => {
  console.error('lm async')
  try {
    const {data} = await getModelsAJAX()
    console.error('lm async res')
    console.error(data)
    dispatch(loadModels(data))
  } catch (error) {
    dispatch(errorThrown(error))
  }
}
