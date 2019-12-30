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
            feature => ({
                type: 'func',
                value: 'LAST',
                args: [
                    {
                        type: 'field',
                        value: `${prefix}${feature.name}`,
                    }
                ],
            })
        )
}


const getTags = feature => feature.match_all
        .reduce((a, m) => {
            a[m.tag] = [m.value]
            return a
    }, {})

const getErrorTags = (feature, name) => Object.assign(
        getTags(feature),
        {model: [name]})

const createErrorQueryConfig = (prefix, model) => {
    const {features, name} = model
    const feature = features[0]

    return {
        ...QUERY_CONFIG,
        fields: createErrorQueryFields(prefix, model),
        database: 'loudml',
        retentionPolicy: DEFAULT_LOUDML_RP,
        measurement: 'loudml',
        tags: getErrorTags(feature, name),
        fill: null,
        groupBy: {
            time: model.bucket_interval,
            tags: [],
        }
    }
}


export const createQueryFromModel = (model) => {
    const {settings} = model
    
    const features = FeaturesUtils.deserializedFeatures(settings.features)
        .filter(feature => feature.io!=='i')

    const m = {
        ...model.settings,
        features,
    }

    const configs = [
        { queryConfig: createErrorQueryConfig(
            'lower_',
            m),
        },
        { queryConfig: createErrorQueryConfig(
            '@',
            m),
        },
        { queryConfig: createErrorQueryConfig(
            'upper_',
            m),
        },
    ]
    return [{
        query: configs.map(
            c => (
                buildQuery(TYPE_QUERY_CONFIG, c.queryConfig.range, c.queryConfig)
            )
            ).join('; ')
        }]
}
