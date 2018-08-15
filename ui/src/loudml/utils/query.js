import {buildQuery} from 'utils/influxql'
import {TYPE_QUERY_CONFIG} from 'src/dashboards/constants'

// import buildQueries from 'utils/buildQueriesForGraphs'
import FeaturesUtils from 'src/loudml/components/FeaturesUtils'

/* SELECT
 *  mean("sin1") + stddev("sin2")
 * AS
 *  "sin"
 * FROM
 *  "ecommerce"."autogen"."prediction_sin"
 * WHERE
 *  time > :dashboardTime:
 * GROUP BY
 *  time(30m)
 * FILL(null)
 */
/*
const uniqueArray = arrArg => {
    return arrArg.filter((elem, pos,arr) => {
        return arr.indexOf(elem) === pos
    })
}
*/
/*
const createPrefixedQueryFields = (prefix, model, database) => {
    const {name, features} = model
    const fields = features.map(f => `LAST("${prefix}${f.name}")`).join(' + ')
    return `SELECT ${fields} AS "${prefix}${name}" FROM "${database}"."autogen"."prediction_${name}" WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(${model.bucket_interval}) FILL(null)`
}
*/
/*
const createQueryFields = (model, database) => {
    const {name, features} = model

    const fields = features.map(f => `${f.metric}("${f.field}")`).join(' + ')
    const from = uniqueArray(features.map(f => `"${database}"."autogen"."${f.measurement}"`)).join(', ')
    return `SELECT ${fields} AS "${name}" FROM ${from} WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(${model.bucket_interval}) FILL(null)`
}
*/

const QUERY_CONFIG_FIELD_ARG = {
    "value": "lower_sin1",
    "type": "field",
    "alias": "",
}

const QUERY_CONFIG_FIELD = {
    "value": "mean",
    "type": "func",
    "alias": "mean_lower_sin1",
    "args": [],
}

const QUERY_CONFIG = {
    "database": null,
    "measurement": null,
    "retentionPolicy": "autogen",
    "fields": [],
    "tags": {},
    "groupBy": {
        "time": null,
        "tags": []
    },
    "areTagsAccepted": false,
    "fill": "null",
    "rawText": null,
    "range": {
        lower: ':dashboardTime:',
        upper: ':upperDashboardTime:'
    },
    "shifts": null,
}

const createPrefixedQueryFields = (prefix, model) => {
    const {features} = model
    return features
        .map(
            f => ({
                ...QUERY_CONFIG_FIELD,
                value: (prefix===null?f.metric:'LAST'),
                alias: (prefix===null?f.name:`${prefix}`),
                args: [
                    {
                        ...QUERY_CONFIG_FIELD_ARG,
                        value: (prefix===null?f.field:`${prefix}_${f.metric}_${f.field}`),
                    }
                ],
            })
        )
}

const createQueryConfig = (prefix, model, database) => {
    const {features, name} = model
    const measurement = (prefix===null?features[0].measurement:`prediction_${name}`)
    return {
        ...QUERY_CONFIG,
        fields: createPrefixedQueryFields(prefix, model),
        database,
        measurement,
        tags: {},   // TODO fill with match_all
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
            source: self,
        },
        { queryConfig: createQueryConfig(
            null,
            m,
            database),
            source: self,
        },
        { queryConfig: createQueryConfig(
            'upper',
            m,
            database),
            source: self,
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


/*
 * SELECT
 *  LAST("lower_mean_foo") AS "lower",
 *  mean("foo") AS "mean_foo",
 *  LAST("upper_mean_foo") AS "upper"
 * FROM 
 *  "metrics"."autogen"."load_avg", 
 *  "metrics"."autogen"."prediction_metrics_load_avg_mean_foo_1m" 
 * WHERE
 *  time > :dashboardTime:
 *  AND time < :upperDashboardTime: 
 * GROUP BY
 *  time(1m) 
 * FILL(null)
 */

/*
export const createQueryFromModel = (model, source, database) => {
    const {settings} = model
    const {links: {self}} = source
    
    const features = FeaturesUtils.deserializedFeatures(settings.features)
        .filter(feature => feature.io!=='i')

    return [{
        query: "SELECT LAST(\"lower_mean_foo\") AS \"lower\" FROM \"metrics\".\"autogen\".\"prediction_metrics_load_avg_mean_foo_1m\" WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(1m) FILL(null); SELECT mean(\"foo\") AS \"mean_foo\" FROM \"metrics\".\"autogen\".\"load_avg\" WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(1m) FILL(null); SELECT LAST(\"upper_mean_foo\") AS \"upper\" FROM \"metrics\".\"autogen\".\"prediction_metrics_load_avg_mean_foo_1m\" WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(1m) FILL(null)"
    }]
}
*/
