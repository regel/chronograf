import {buildQuery} from 'utils/influxql'
import {TYPE_QUERY_CONFIG} from 'src/dashboards/constants'

import FeaturesUtils from 'src/loudml/components/FeaturesUtils'

const QUERY_CONFIG = {
    retentionPolicy: 'autogen',
    areTagsAccepted: true,
    rawText: null,
    range: {
        lower: ':dashboardTime:',
        upper: ':upperDashboardTime:'
    },
    shifts: null,
}

const createErrorQueryFields = (prefix, model) => {
    const {features} = model

    return features
        .map(
            f => ({
                type: 'func',
                value: 'LAST',
                alias: prefix,
                args: [
                    {
                        type: 'field',
                        alias: '',
                        value: `${prefix}_${f.metric}_${f.field}`,
                    }
                ],
            })
        )
}

const createModelQueryFields = (model) => {
    const {features} = model

    return features
        .map(
            f => ({
                type: 'func',
                value: f.metric,
                alias: f.name,
                args: [
                    {
                        type: 'field',
                        alias: '',
                        value: f.field,
                    }
                ],
            })
        )
}

const createErrorQueryConfig = (prefix, model, database) => {
    const {name} = model

    return {
        ...QUERY_CONFIG,
        fields: createErrorQueryFields(prefix, model),
        database,
        measurement: `prediction_${name}`,
        tags: {},
        fill: null,
        groupBy: {
            time: model.bucket_interval,
            tags: [],
        }
    }
}

const createModelQueryConfig = (model, database) => {
    const {features} = model
    const feature = features[0]
    const measurement = feature.measurement
    const tags = feature.match_all
        .reduce((a, m) => {
                a[m.tag] = [m.value]
                return a
        }, {})

    return {
        ...QUERY_CONFIG,
        fields: createModelQueryFields(model),
        database,
        measurement,
        tags,
        fill: feature.default,
        groupBy: {
            time: model.bucket_interval,
            tags: [],
        }
    }
}

export const createQueryFromModel = (model, source, database) => {
    const {settings} = model
    const {links: {self}} = source
    
    const features = FeaturesUtils.deserializedFeatures(settings.features)
        .filter(feature => feature.io!=='i')

    const m = {
        ...model.settings,
        features,
    }

    const configs = [
        { queryConfig: createErrorQueryConfig(
            'lower',
            m,
            database),
        },
        { queryConfig: createModelQueryConfig(
            m,
            database),
        },
        { queryConfig: createErrorQueryConfig(
            'upper',
            m,
            database),
        },
    ]
    return [{
        source: self,
        query: configs.map(
            c => (
                buildQuery(TYPE_QUERY_CONFIG, c.queryConfig.range, c.queryConfig)
            )
            ).join('; ')
        }]
}
