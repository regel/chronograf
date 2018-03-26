import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import * as modelActionCreators from 'src/loudml/actions/view'

import {getModel} from 'src/loudml/apis'

import {bindActionCreators} from 'redux'
import Model from 'src/loudml/components/Model'

class ModelPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      handlersFromConfig: [],
      model: props.params.modelName ? undefined : {},
    }
  }

  async componentDidMount() {
    const {params} = this.props

    if (params.modelName) {
      getModel(params.modelName).then(res => {
        this.setState({model: res.data})
        this.model.setState({model: res.data})
      })
    }
  }

  render() {
    const {params, source, modelActions, addFlashMessage, router} = this.props
    const {model} = this.state

    if (params.modelName && model === undefined) {
      return <span className="icon spinner" />
    }

    return (
      <Model
        ref={ref => (this.model = ref)}
        source={source}
        router={router}
        model={model}
        modelActions={modelActions}
        addFlashMessage={addFlashMessage}
        modelName={params.modelName}
        configLink={`/loudml/models/edit/${params.modelName}`}
      />
    )
  }
}

const {func, shape, string} = PropTypes

ModelPage.propTypes = {
  source: shape({
    links: shape({
      proxy: string.isRequired,
      self: string.isRequired,
    }),
  }),
  router: shape({}).isRequired,
  addFlashMessage: func,
  model: shape({}).isRequired,
  modelActions: shape({
    getModel: func.isRequired,
  }).isRequired,
  params: shape({
    modelName: string,
  }),
}

const mapStateToProps = model => ({
  model,
})

const mapDispatchToProps = dispatch => ({
  modelActions: bindActionCreators(modelActionCreators, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelPage)
