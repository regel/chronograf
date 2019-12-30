import React from 'react'
import PropTypes from 'prop-types'

const AboutTextStyle = {
    fontSize: '20px',
    fontWeight: 400,
    margin: 0,
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    color: '#eeeff2',
    marginBottom: '2em',
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
                    It's plug-and-play, so you can use it for other projects too.
                </p>
                <p style={AboutTextStyle}>
                    Contribute to the open source software development on <a href="https://github.com/regel/loudml" target="_github">GitHub</a>.
                </p>
                <p style={AboutTextStyle}>
                    Or if you're not sure about machine learning, <a href="https://loudml.io/contact-us/" target="_loudml">contact us</a> to find out how we can help find the best solution to your problem.
                </p>
            </div>
        </div>
    )

const {string} = PropTypes

AboutPanel.propTypes = {
    version: string,
}

export default AboutPanel
