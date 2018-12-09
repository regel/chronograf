/** @flow */
import PropTypes from 'prop-types';
import * as React from 'react';
import moment from 'moment'
import _ from 'lodash'

import AnomalySwimlanes from 'src/loudml/components/AnomalySwimlanes';
import InvalidData from 'src/shared/components/InvalidData'

// import styles from './MultiGrid.example.css';

// const STYLE = {
//   border: '1px solid #ddd',
// };
// const STYLE_BOTTOM_LEFT_GRID = {
//   borderRight: '2px solid #aaa',
//   backgroundColor: '#f7f7f7',
// };
// const STYLE_TOP_LEFT_GRID = {
//   borderBottom: '2px solid #aaa',
//   borderRight: '2px solid #aaa',
//   fontWeight: 'bold',
// };
// const STYLE_TOP_RIGHT_GRID = {
//   borderBottom: '2px solid #aaa',
//   fontWeight: 'bold',
// };

const validateTimeSeries = ts => {
  return _.every(ts, r =>
    _.every(
      r,
      // @ts-ignore
      (v, i) =>
        (i === 0 && Date.parse(v)) || _.isNumber(v) || _.isNull(v)
    )
  )
}

const transformData = (data) => {
  // get timeseries
  const size = data.length
  const dates = data.reduce((d, item) => {
    const anomalies = item.anomalies.reduce((r, a) => {
      const start = moment(a.start_date).valueOf()
      const end = moment(a.end_date).valueOf()
      return [...r, start, end]
    }, [])
    return [...d, ...anomalies]
  }, [])
  const serie = _.uniq(dates).sort((a, b) => (a-b))
  const series = serie.map(t => {
    const time = moment(t)
    const values = data.reduce((r, d, i) => {
      const between = d.anomalies.some(a => (time.isBetween(a.start_date, a.end_date, null, '[]')))
      const value = (between?size-i:null)
      // const anomalie = d.anomalies.find(a => (time.isBetween(a.start_date, a.end_date, null, '[]')))
      // const value = (anomalie?anomalie.score:null)
      return [...r, value]
    }, [])
    return [time.toDate(), ...values]
  })
  return {
    timeSeries: series,
    labels: ['time', ...data.reduce((r, d) => ([...r, d.key]), [])],
    anomalies: data,
  }
}

export default class AnomalyExplorer extends React.PureComponent {
   timeSeries
   isValidData = false

  constructor(props, context) {
    super(props, context);

    this.state = {
      fixedColumnCount: 2,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0,
      timeRange: {
        lower: '2018-11-20T00:00:00Z',
        upper: '2018-11-21T00:00:00Z',
      },
      groupBy: '1h',
    };

    // this._cellRenderer = this._cellRenderer.bind(this);
    // this._onFixedColumnCountChange = this._createEventHandler(
    //  'fixedColumnCount',
    // );
    // this._onFixedRowCountChange = this._createEventHandler('fixedRowCount');
    // this._onScrollToColumnChange = this._createEventHandler('scrollToColumn');
    // this._onScrollToRowChange = this._createEventHandler('scrollToRow');
  }

  componentWillMount() {
      const {anomalies} = this.props
      this.parseTimeSeries(anomalies)
  }

  parseTimeSeries(anomalies) {
    this.timeSeries = transformData(anomalies)
    this.isValidData = validateTimeSeries(
      _.get(this.timeSeries, 'timeSeries', [])
    )
  }
  
  componentWillUpdate(nextProps) {
    const {anomalies} = this.props
    if (
      anomalies !== nextProps.anomalies
    ) {
      this.parseTimeSeries(nextProps.anomalies)
    }
  }

  render() {
    const {
      timeRange,
      groupBy,
    } = this.state
    const {colors} = this.props
    const {labels, timeSeries, anomalies} = this.timeSeries
    
    if (!this.isValidData) {
      return <InvalidData />
    }

    return (
      <div>
        {timeSeries.length
          ?(<AnomalySwimlanes
            timeSeries={timeSeries}
            labels={labels}
            anomalies={anomalies}
            timeRange={timeRange}
            groupBy={groupBy}
            setResolution={this.handleSetResolution}
            colors={colors}
            />)
          :(<GraphSpinner />)
        }
        <div id="legend" style={{paddingTop: '2em'}}/>
        {/* <div>
          {timeSeries.length}
          {JSON.stringify(timeSeries)}
        </div> */}
      </div>
    );
  }

  handleSetResolution = resolution => {
    this.setState({resolution})
  }

  // _cellRenderer({columnIndex, key, rowIndex, style}) {
  //   return (
  //     <div className={styles.Cell} key={key} style={style}>
  //       {columnIndex}, {rowIndex}
  //     </div>
  //   );
  // }

  // _createEventHandler(property) {
  //   return event => {
  //     const value = parseInt(event.target.value, 10) || 0;

  //     this.setState({
  //       [property]: value,
  //     });
  //   };
  // }

  // _createLabeledInput(property, eventHandler) {
  //   const value = this.state[property];

  //   return (
  //     <LabeledInput
  //       label={property}
  //       name={property}
  //       onChange={eventHandler}
  //       value={value}
  //     />
  //   );
  // }
}

const {arrayOf, shape} = PropTypes

AnomalyExplorer.propTypes = {
    anomalies: arrayOf(shape({})),
    colors: arrayOf(shape({})),
}

const GraphSpinner = () => (
  <div className="graph-fetching">
    <div className="graph-spinner" />
  </div>
)
