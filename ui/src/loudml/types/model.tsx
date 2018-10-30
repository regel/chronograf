interface Feature {

}

export interface ModelSettings {
    name: string
    type: string
    run: {}
    features: Feature[]
    default_datasource: string
    max_evals: number
    width?: number
    height?: number
    key?: string
}

interface ModelState {
    trained: boolean
    loss: number
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
    training: ModelTraining
}

export interface Job {
    id: string
    name: string
    type: string
}

export interface TimeRange {
    lower: string
    upper: string
}
