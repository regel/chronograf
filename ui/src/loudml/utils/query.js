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
const createQueryFields = (prefix, alias, features, database) => {
    const fields = features.map(f => `${f.metric}("${prefix}${f.name}")`).join(' + ')
    return `SELECT
     ${fields}
     AS ${prefix}${alias}
     FROM "${database}"."autogen"."prediction_${alias}"
     WHERE time > :dashboardTime:
     AND time < :upperDashboardTime:
     GROUP BY time(30m)
     FILL(null)`
}

export const createQueryFromModel = (model, source, database) => {
    const {settings: {name, features}} = model
    const {links: {self}} = source
    
    const d = FeaturesUtils.deserializedFeatures(features)
        .filter(feature => feature.io!=='i')

    return [
        { query: createQueryFields('lower_', name, d, database), source: self, },
        { query: createQueryFields('', name, d, database), source: self, },
        { query: createQueryFields('upper_', name, d, database), source: self, },
    ]
}
