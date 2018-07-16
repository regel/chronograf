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
const createQueryFields = (prefix, alias, features) => {
    const fields = features.map(f => `${f.metric}("${prefix}${f.name}")`).join(' + ')
    return `SELECT
     ${fields}
     AS ${prefix}${alias}
     FROM "ecommerce"."autogen"."prediction_${alias}"
     WHERE time > :dashboardTime:
     AND time < :upperDashboardTime:
     GROUP BY time(30m)
     FILL(null)`
}

export const createQueryFromModel = model => {
    const {settings: {name, features}} = model
    
    const d = FeaturesUtils.deserializedFeatures(features)
        .filter(feature => feature.io!=='i')
        // .map(feature => createQueryFields(name, feature))

    return [
        { query: createQueryFields('lower_', name, d) },
        { query: createQueryFields('', name, d) },
        { query: createQueryFields('upper_', name, d) },
    ]
}
