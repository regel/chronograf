import React, {PropTypes, Component} from 'react'

import Dropdown from 'shared/components/Dropdown'

import {getDatasources} from 'src/loudml/apis'

class DatasourceSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datasources: null,
            error: false,
        }
    }

    componentDidMount() {
        getDatasources()
            .then(res => {
                const state = {datasources: []}

                res.data.forEach(ds => {
                    if (ds.type === 'influxdb') {
                        state.datasources.push({text: ds.name})
                    }
                })

                if (state.datasources.length === 1) {
                    state.datasource = state.datasources[0].text
                }
                this.setState(state)
            })
            .catch(() => this.setState({error: true}))
    }

    onChoose = e => {
        this.props.onChoose(e.text)
    }

    renderDatasourceList() {
        const {datasource} = this.props
        const {datasources, error} = this.state

        if (error) {
            return <p>Error! Could not get data source list</p>
        }
        if (datasources === null) {
            return <p>Retrieving data source list...</p>
        }
        return (
            <Dropdown
                name="default_datasource"
                items={datasources}
                onChoose={this.onChoose}
                selected={datasource || ''}
                className="dropdown-stretch"
            />
        )
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="default_datasource">Data source</label>
                {this.renderDatasourceList()}
            </div>
        )
    }
}

DatasourceSection.propTypes = {
    datasource: PropTypes.string,
    onChoose: PropTypes.func,
}

export default DatasourceSection
