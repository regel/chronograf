import React from 'react'
import PropTypes from 'prop-types'
import SponsorButton from './SponsorButton'

const AboutTextStyle = {
    fontSize: '20px',
    fontWeight: 400,
    margin: 0,
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    color: '#eeeff2',
    marginBottom: '2em',
}

const CenteredButton = {
    textAlign: 'center',
}

const AboutPanel = ({
    version,
}) => (
        <div className="panel panel-solid">
            <div className="panel-heading">
                <h2 className="panel-title" />
            </div>
            <div className="panel-body">
                <p style={AboutTextStyle}>
                    You're using Loud ML {version} — an independent machine learning add-on designed here for InfluxData’s TICK-L stack.
                </p>
                <p style={AboutTextStyle}>
                    Contribute to the open source software development on <a href="https://github.com/regel/loudml" target="_github">GitHub</a>.
                </p>
                <p style={AboutTextStyle}>
                    Join our AI sponsors today!
                </p>
                <div style={CenteredButton}>
                <SponsorButton/>
                </div>
            </div>
        </div>
    )

const {string} = PropTypes

AboutPanel.propTypes = {
    version: string,
}

export default AboutPanel
