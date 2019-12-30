interface Feature {
    io?: string
    scores?: string
    transform?: string|null
}

export interface ModelSettings {
    name: string
    type: string
    run?: {}
    features: Feature[]
    default_bucket: string
    bucket_interval: string
    interval: string
    max_evals: number
    offset: string
    forecast?: number
    span: number
    grace_period?: number
    max_threshold: number
    min_threshold: number
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
    model?: string
}

export interface ModelType {
    name: string
    type: string
        default: boolean
}
