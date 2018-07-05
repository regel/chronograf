export default class {
    static deserializeFeature(feature, direction) {
        return Object.assign({}, feature, {'io': direction})
    }

    static deserializedFeatures(features) {
        const i = (features.i
            ?features.i.map(feature => this.deserializeFeature(feature, 'in'))
            :[])
        const o = (features.o
            ?features.o.map(feature => this.deserializeFeature(feature, 'out'))
            :[])
        const io = (features.io
            ?features.io.map(feature => this.deserializeFeature(feature, 'in/out'))
            :[])
        const localFeatures = (
        Array.isArray(features)
        ? features.map(feature => this.deserializeFeature(feature, 'in/out'))
        : [ // expand object features
            ...i,
            ...o,
            ...io,
        ])

        return localFeatures
    }

    static serializedFeatures(features) {
        // serialize features Array
        const i = features.filter(feature => this.iMap(feature)).map(feature => this.serializeFeature(feature))
        const o = features.filter(feature => this.oMap(feature)).map(feature => this.serializeFeature(feature))
        const io = features.filter(feature => this.ioMap(feature)).map(feature => this.serializeFeature(feature))
        
        const localFeatures = Object.assign({},
        (i.length ? {'i': [...i]} : null),
        (o.length ? {'o': [...o]} : null),
        (io.length ? {'io': [...io]} : null))

        return localFeatures
    }

    static serializeFeature(feature) {
        const newFeature = {...feature}
        delete newFeature.io
        return newFeature
    }

    static iMap(feature) {
        return feature.io==='in'
    }

    static oMap(feature) {
        return feature.io==='out'
    }

    static ioMap(feature) {
        return feature.io==='in/out'
    }

}
