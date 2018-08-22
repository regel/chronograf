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

const createPrefixedQueryFields = (prefix, model) => {
    const {features} = model
    return features
        .map(
            f => ({
                type: 'func',
                value: (prefix===null?f.metric:'LAST'),
                alias: (prefix===null?f.name:`${prefix}`),
                args: [
                    {
                        type: 'field',
                        alias: '',
                        value: (prefix===null?f.field:`${prefix}_${f.metric}_${f.field}`),
                    }
                ],
            })
        )
}

const createQueryConfig = (prefix, model, database) => {
    const {features, name} = model
    const feature = features[0]
    const measurement = (prefix===null?feature.measurement:`prediction_${name}`)
    const tags = feature.match_all
        .reduce((a, m) => {
                a[m.tag] = [m.value]
                return a
        }, {})
    return {
        ...QUERY_CONFIG,
        fields: createPrefixedQueryFields(prefix, model),
        database,
        measurement,
        tags,
        fill: (prefix===null?feature.default:null),
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
        { queryConfig: createQueryConfig(
            'lower',
            m,
            database),
        },
        { queryConfig: createQueryConfig(
            null,
            m,
            database),
        },
        { queryConfig: createQueryConfig(
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
