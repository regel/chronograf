import React, {Component, PropTypes} from 'react'

class NameSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reset: false,
    }
  }

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.inputRef.blur()
    }
    if (e.key === 'Escape') {
      this.inputRef.value = ''
      this.setState({reset: true}, () => this.inputRef.blur())
    }
  }

  render() {
    const {modelName, onEdit} = this.props

    return (
      <div className="model-section">
        <h3 className="model-section--heading">
          {modelName ? 'Name' : 'Name this model'}
        </h3>
        <div className="model-section--body">
          <div className="model-section--row model-section--row-first model-section--row-last">
            {modelName
              ? <p>
                  {modelName}
                </p>
              : <input
                  type="text"
                  name="name"
                  className="form-control input-md form-malachite"
                  onKeyDown={this.handleKeyDown}
                  onChange={onEdit}
                  placeholder="ex: my-model"
                  ref={r => (this.inputRef = r)}
                />}
          </div>
        </div>
      </div>
    )
  }
}

const {func, string} = PropTypes

NameSection.propTypes = {
  modelName: string,
  onEdit: func.isRequired,
}

export default NameSection
