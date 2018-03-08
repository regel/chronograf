import React, {PropTypes, Component} from 'react'

import ModelsTable from 'src/loudml/components/ModelsTable'

import {getModels} from 'src/loudml/apis'

class LoudMLApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      models: [],
    }
  }

  componentDidMount() {
    this.fetchModels()
  }

  fetchModels = () => {
    getModels().then(res => {
      this.setState({loading: false, models: res.data})
    })
  }

  renderSubComponents = () => {
    const {source} = this.props
    return <ModelsTable source={source} models={this.state.models} />
  }

  handleApplyTime = timeRange => {
    this.setState({timeRange})
  }

  render() {
    const {isWidget} = this.props
    const {loading} = this.state

    if (loading) {
      return <div className="page-spinner" />
    }

    return isWidget
      ? this.renderSubComponents()
      : <div className="page loudml-page">
          <div className="page-header">
            <div className="page-header__container">
              <div className="page-header__left">
                <h1 className="page-header__title">LoudML</h1>
              </div>
            </div>
          </div>
          <div className="page-contents">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  {this.renderSubComponents()}
                </div>
              </div>
            </div>
          </div>
        </div>
  }
}

const {bool, shape, string} = PropTypes

LoudMLApp.propTypes = {
  source: shape({
    links: shape({
      proxy: string.isRequired,
      self: string.isRequired,
    }),
  }),
  isWidget: bool,
}

export default LoudMLApp
