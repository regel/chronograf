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
const uniqueArray = arrArg => {
    return arrArg.filter((elem, pos,arr) => {
        return arr.indexOf(elem) === pos
    })
}

const createPrefixedQueryFields = (prefix, model, database) => {
    const {name, features, bucketInterval} = model
    const fields = features.map(f => `LAST("${prefix}${f.name}")`).join(' + ')
    return `SELECT ${fields} AS "${prefix}${name}" FROM "${database}"."autogen"."prediction_${name}" WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(${bucketInterval}) FILL(null)`
}

const createQueryFields = (model, database) => {
    const {name, features, bucketInterval} = model

    const fields = features.map(f => `${f.metric}("${f.field}")`).join(' + ')
    const from = uniqueArray(features.map(f => `"${database}"."autogen"."${f.measurement}"`)).join(', ')
    return `SELECT ${fields} AS "${name}" FROM ${from} WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(${bucketInterval}) FILL(null)`
    // SELECT ${metric}("${field-name}") AS "${metric}-${field-name}" FROM "${database}"."autogen"."${measurement}" WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(${bucketInterval}) FILL(null)
}

export const createQueryFromModel = (model, source, database) => {
    // const {settings: {features}} = model
    const {links: {self}} = source
    
    const features = FeaturesUtils.deserializedFeatures(model.settings.features)
        .filter(feature => feature.io!=='i')

    const m = {
        ...model.settings,
        features,
    }

    return [
        { query: createPrefixedQueryFields('lower_', m, database), source: self, },
        { query: createQueryFields(m, database), source: self, },
        { query: createPrefixedQueryFields('upper_', m, database), source: self, },
    ]
}
