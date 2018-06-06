export const DEFAULT_MODEL = {
  bucket_interval: '20m',
  default_datasource: null,
  features: {},
  interval: '1m',
  max_evals: 100,
  name: null,
  offset: '10s',
  seasonality: {
    daytime: false,
    weekday: false,
  },
  span: 5,
  type: 'timeseries',
}

export const DEFAULT_FEATURE = {
  name: null,
  measurement: null,
  field: null,
  metric: 'avg',
  default: null,
  io: 'io',
}

export const DEFAULT_METRICS = ['avg', 'count', 'med', 'sum', 'min', 'max']
export const DEFAULT_IO = ['i/o', 'i', 'o']

export const MODEL_CREATED = 'MODEL_CREATED';
export const MODEL_UPDATED = 'MODEL_UPDATED';
export const MODELS_LOADED = 'MODELS_LOADED';
export const MODEL_DELETED = 'MODEL_DELETED';
export const START_JOB = 'START_LOUDML_JOB';
export const STOP_JOB = 'STOP_LOUDML_JOB';
export const UPDATE_JOBS = 'UPDATE_LOUDML_JOBS'
