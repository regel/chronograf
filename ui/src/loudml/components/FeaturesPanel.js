import React, {PropTypes, Component} from 'react'

import Feature from 'src/loudml/components/Feature'
import {DEFAULT_FEATURE} from 'src/loudml/constants'

import 'src/loudml/styles/feature.css'

class FeaturesPanel extends Component {
    constructor(props) {
        super(props)
    }

    getMeasurements = () => {

    }

    addFeature = () => {
        const {features} = this.props
        features.push({...DEFAULT_FEATURE})
        this.onInputChange(features)
    }

    deleteFeature = toDelete => {
        let {features} = this.props

        features = features.filter(feature => feature !== toDelete)
        this.onInputChange(features)
    }

    editFeature = (toEdit, val) => {
        let {features} = this.props

        features = features.map(
            feature => (feature === toEdit) ? {...toEdit,...val} : feature
        )
        this.onInputChange(features)
    }

    onInputChange = features => {
        const {onInputChange} = this.props

        onInputChange({
            target: {
                name: 'features',
                type: typeof features,
                value: features
            }
        })
    }

    get title() {
        const {features} = this.props

        if (features.length === 0) {
            return ''
        }

        return (features.length === 1
            ? '1 Feature'
            : `${features.length} Features`)
    }

    render() {
        const {features} = this.props

        return (
            <div className="panel panel-solid">
                <div className="panel-heading">
                    <h2 className="panel-title">
                        {this.title}
                    </h2>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={this.addFeature}
                    >
                        <span className="icon plus" /> Add feature
                    </button>
                </div>
                <div className="panel-body">
                    {features.length
                        ? features.map((feature, index) => (
                            <Feature
                                key={`${index}_${features.length}`}
                                feature={feature}
                                onDelete={this.deleteFeature}
                                onEdit={this.editFeature}
                            />))
                        : <i>No feature</i>}
                </div>
            </div>
        )
    }
}

const {arrayOf, func, shape} = PropTypes

FeaturesPanel.propTypes = {
    features: arrayOf(shape({})),
    onInputChange: func.isRequired,
}

export default FeaturesPanel
