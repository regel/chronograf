interface Feature {

}

interface Seasonality {
    daytime: boolean
    weekday: boolean
}

export interface ModelSettings {
    name: string
    type: string
    run?: {}
    features: Feature[]
    default_datasource: string
    default_datasink?: string
    bucket_interval: string
    interval: string
    max_evals: number
    offset: string
    seasonality: Seasonality
    forecast: number
    span: number
    grace_period?: number
    max_threshold: number
    min_threshold: number
    width?: number
    height?: number
    key?: string
    timestamp_field?: string
}

interface ModelState {
    trained: boolean
    loss?: number
}

interface ModelTraining {
    job_id: string
    progress: {
        eval: number
        max_evals: number
    }
    state: string
}

export interface Model {
    settings: ModelSettings
    state: ModelState
    training?: ModelTraining
}

export interface Job {
    id: string
    name: string
    type: string
}
