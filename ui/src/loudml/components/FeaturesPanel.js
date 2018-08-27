import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import {notify as notifyAction} from 'shared/actions/notifications'

import Feature from 'src/loudml/components/Feature'

import {TEN_SECONDS} from 'shared/constants/index'
import {DEFAULT_FEATURE} from 'src/loudml/constants'

import 'src/loudml/styles/feature.css'

const defaultErrorNotification = {
    type: 'error',
    icon: 'alert-triangle',
    duration: TEN_SECONDS,
}

const notifyFeatureNameInvalid = () => ({
    ...defaultErrorNotification,
    message: 'Feature name cannot be blank.',
  })
  
const notifyFeatureNameAlreadyExists = () => ({
    ...defaultErrorNotification,
    message: 'A Feature by this name already exists.',
  })
  
class FeaturesPanel extends Component {
    constructor(props) {
        super(props)
    }

    getMeasurements = () => {

    }

    addFeature = () => {
        const {features} = this.props
        // features.push({...DEFAULT_FEATURE, isEditing: true})
        this.onInputChange([
            {...DEFAULT_FEATURE, isEditing: true},
            ...features
        ])
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

    handleConfirmFeature = feature => {
        const {notify, features} = this.props
        
        if (!feature.name) {
            return notify(notifyFeatureNameInvalid())
        }
    
        if (features.find(f => f!==feature && f.name === feature.name) !== undefined) {
            return notify(notifyFeatureNameAlreadyExists())
        }
    
        // delete feature.isEditing
        this.onInputChange(
            features.map(f => (
                f===feature?delete f.isEditing&&f:f))
            )
    }

    handleKeyDownFeature = feature => e => {
        const {key} = e
    
        if (key === 'Escape') {
            this.deleteFeature(feature)
        }
    
        if (key === 'Enter') {
            this.handleConfirmFeature(feature)
        }
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
                                onCancel={this.deleteFeature}
                                onEdit={this.editFeature}
                                onKeyDown={this.handleKeyDownFeature}
                                onConfirm={this.handleConfirmFeature}
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
    notify: func.isRequired,
}

const mapDispatchToProps = dispatch => ({
    notify: message => dispatch(notifyAction(message))
})

export default connect(null, mapDispatchToProps)(FeaturesPanel)
