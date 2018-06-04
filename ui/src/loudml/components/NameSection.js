import React, {Component, PropTypes} from 'react'

class NameSection extends Component {
  constructor(props) {
    super(props)

  }
/*
  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.inputRef.blur()
    }
    if (e.key === 'Escape') {
      this.inputRef.value = ''
      this.setState({reset: true}, () => this.inputRef.blur())
    }
  }
*/
  render() {
    const {modelName, onEdit, isCreating} = this.props

    return (
      <div className="form-group">
        <label htmlFor="name">
          {isCreating ? 'Name this model' : 'Name'}
        </label>
        {isCreating
          ? <input
              type="text"
              name="name"
              className="form-control input-sm form-malachite"
              // onKeyDown={this.handleKeyDown}
              onChange={onEdit}
              placeholder="ex: my-model"
              // ref={r => (this.inputRef = r)}
            />
          : <p>
              {modelName}
            </p>
        }
      </div>
    )
  }
}

NameSection.propTypes = {
  modelName: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
}

export default NameSection
