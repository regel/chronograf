import {buildQuery} from 'utils/influxql'
import {TYPE_QUERY_CONFIG} from 'src/dashboards/constants'

import FeaturesUtils from 'src/loudml/components/FeaturesUtils'
import { DEFAULT_LOUDML_RP } from 'src/loudml/constants';

const QUERY_CONFIG = {
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

const getTags = feature => {
    return feature.match_all
        .reduce((a, m) => {
            a[m.tag] = [m.value]
            return a
    }, {})
}

const createErrorQueryConfig = (prefix, model, datasource) => {
    const {features} = model
    const feature = features[0]

    return {
        ...QUERY_CONFIG,
        fields: createErrorQueryFields(prefix, model),
        database: datasource.database,
        retentionPolicy: datasource.retention_policy||DEFAULT_LOUDML_RP,
        measurement: 'loudml',
        tags: getTags(feature),
        fill: null,
        groupBy: {
            time: model.bucket_interval,
            tags: [],
        }
    }
}

const createModelQueryConfig = (model, datasource) => {
    const {features} = model
    const feature = features[0]
    const measurement = feature.measurement

    return {
        ...QUERY_CONFIG,
        fields: createModelQueryFields(model),
        database: datasource.database,
        retentionPolicy: datasource.retention_policy||DEFAULT_LOUDML_RP,
        measurement,
        tags: getTags(feature),
        fill: feature.default,
        groupBy: {
            time: model.bucket_interval,
            tags: [],
        }
    }
}

export const createQueryFromModel = (model, source, datasource) => {
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
            datasource),
        },
        { queryConfig: createModelQueryConfig(
            m,
            datasource),
        },
        { queryConfig: createErrorQueryConfig(
            'upper',
            m,
            datasource),
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
