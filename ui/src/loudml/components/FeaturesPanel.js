import React, {PropTypes, Component} from 'react'

import FeaturesTable from 'src/loudml/components/FeaturesTable'
import {DEFAULT_FEATURE} from 'src/loudml/constants'

class FeaturesPanel extends Component {
  constructor(props) {
    super(props)
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

  render() {
    const {features} = this.props

    return (
      <div className="panel panel-solid">
        <div className="panel-heading">
          <h2 className="panel-title">
          </h2>
          <button
            className="btn btn-sm btn-primary"
            onClick={this.addFeature}
            // disabled={features.some(f => !f.name)}
          >
            <span className="icon plus" /> Add feature
          </button>
        </div>
        <div className="panel-body">
          {features.length
            ? <FeaturesTable
                features={features}
                onDelete={this.deleteFeature}
                onEdit={this.editFeature}
              />
            : <i>No feature</i>}
        </div>
      </div>
    )
  }
}

FeaturesPanel.propTypes = {
  features: PropTypes.arrayOf(PropTypes.shape({})),
  onInputChange: PropTypes.func.isRequired,
}

export default FeaturesPanel
