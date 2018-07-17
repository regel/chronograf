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
const createQueryFields = (prefix, alias, features, database, groupBy) => {
    const fields = features.map(f => `LAST("${prefix}${f.name}")`).join(' + ')
    return `SELECT ${fields} AS "${prefix}${alias}" FROM "${database}"."autogen"."prediction_${alias}" WHERE time > :dashboardTime: AND time < :upperDashboardTime: GROUP BY time(${groupBy}) FILL(null)`
}

export const createQueryFromModel = (model, source, database) => {
    const {settings: {name, features, bucket_interval}} = model
    const {links: {self}} = source
    
    const d = FeaturesUtils.deserializedFeatures(features)
        .filter(feature => feature.io!=='i')

    return [
        { query: createQueryFields('lower_', name, d, database, bucket_interval), source: self, },
        { query: createQueryFields('', name, d, database, bucket_interval), source: self, },
        { query: createQueryFields('upper_', name, d, database, bucket_interval), source: self, },
    ]
}
