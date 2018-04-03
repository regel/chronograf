const initialState = {
  models: null,
}

const loudml = (state = initialState, action) => {
  switch (action.type) {
    case 'LOUDML_LOAD_MODELS': {
      return {...state, ...action.payload}
    }
  }

  return state
}

export default loudml
