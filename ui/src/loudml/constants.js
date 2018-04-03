export const DEFAULT_FEATURE = {
  name: 'new-feature',
  measurement: 'my-measurement',
  field: 'my-field',
  metric: 'count',
}

export const DEFAULT_MODEL = {
  name: 'new-model',
  type: 'timeseries',
  span: 5,
  features: [DEFAULT_FEATURE], /* TODO remove */
}

