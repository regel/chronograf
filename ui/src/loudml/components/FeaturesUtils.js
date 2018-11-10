import { DEFAULT_FEATURE } from 'src/loudml//constants';

export default class {
    static deserializeFeature(feature, direction) {
        return {
            ...DEFAULT_FEATURE, // force new parameters on Loudl ML upgrades
            ...feature,
            io: feature.io||direction   // force direction for Loud ML 1.3
        }
    }

    static deserializedFeatures(features) {
        return (
            Array.isArray(features)     // LoudML 1.3, 1.4.3 and higher
            ? features.map(feature => this.deserializeFeature(feature, 'io'))
            : Object.entries(features)  // Loud ML 1.4 (introducing io for timeseries)
                .map(([key, value]) => value.map(f => this.deserializeFeature(f, key)))
                .reduce((a, f) => [...a, ...f], [])
        )
    }
}
