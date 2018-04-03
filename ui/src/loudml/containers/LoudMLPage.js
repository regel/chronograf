import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {loadModelsAsync} from 'src/loudml/actions'

import FancyScrollbar from 'shared/components/FancyScrollbar'

import {notify as notifyAction} from 'shared/actions/notifications'

class LoudMLPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {loadModels} = this.props
    loadModels()
  }

  render() {
    const {models} = this.props

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-header__container">
            <div className="page-header__left">
              <h1 className="page-header__title">LoudML</h1>
            </div>
          </div>
        </div>
        <FancyScrollbar className="page-contents">
          {models ? (
            <div className="container-fluid">
              <div className="row">{JSON.stringify(models)}</div>
            </div>
          ) : (
            <div className="page-spinner" />
          )}
        </FancyScrollbar>
      </div>
    )
  }
}

const {arrayOf, func, shape, string} = PropTypes

LoudMLPage.propTypes = {
  source: shape({
    id: string.isRequired,
    links: shape({
      users: string.isRequired,
    }),
  }).isRequired,
  models: arrayOf(shape()),
  loadModels: func,
  notify: func.isRequired,
}

const mapStateToProps = a => {
  console.error('plop')
  console.error(a)
  return a
}

const mapDispatchToProps = dispatch => ({
  loadModels: bindActionCreators(loadModelsAsync, dispatch),
  notify: bindActionCreators(notifyAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoudMLPage)
