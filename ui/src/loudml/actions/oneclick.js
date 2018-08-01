export const UNDEFINED_DATASOURCE = 'Unable to find LoudML datasource for selected database. Check configuration'
export const SELECT_FEATURE = 'Select one field'
export const SELECT_BUCKET_INTERVAL = 'Select a \'Group by\' value'

export const notifyDatasource = datasource => {
    return `<h1>Loud ML Datasource:</h1><p>${datasource}</p>`
}

export const notifyFeature = feature => {
    return `<h1>Feature:</h1><p>${feature}</p>`
}

export const notifyInterval = interval => {
    return `<h1>Aggregation interval:</h1><p>${interval}</p>`
}
