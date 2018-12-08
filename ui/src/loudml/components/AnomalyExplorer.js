/** @flow */
import PropTypes from 'prop-types';
import * as React from 'react';
import AnomalySwimlanes from 'src/loudml/components/AnomalySwimlanes';
import uuid from 'uuid'
import moment from 'moment'
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

export default class AnomalyExplorer extends React.PureComponent {

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

  render() {
    const {
      timeRange,
      groupBy,
    } = this.state
    const {colors} = this.props

    const data = this.data

    return (
      <div>
        <AnomalySwimlanes
          data={data}
          timeRange={timeRange}
          groupBy={groupBy}
          setResolution={this.handleSetResolution}
          colors={colors}
          />
        {data.length}
        {JSON.stringify(data)}
      </div>
    );
  }

  handleSetResolution = resolution => {
    this.setState({resolution})
  }

  get data() {
    // const {timeRange: {
    //   lower,
    //   upper,
    // }} = this.state
    const rowFactor = 10;  // TODO replace with dropdown or input
    const rows = Math.floor(Math.random()*rowFactor)+1;

    const lower = moment().subtract(7, 'days')

    function randomDate(from, to) {
      // const range = to - from
      const start = moment(from + Math.random() * (to - from))
      const end = moment(start + Math.random() * (to - start))
      return {start, end}
    }


    const START_DATE = moment(lower)

    return new Array(rows).fill(null).map(_ => {
      const anomalies = Math.floor(Math.random()*3)+1
      const range = Math.floor((moment().valueOf() - START_DATE.valueOf())/anomalies)
      return {
        key: uuid.v4(),
        'anomalies': new Array(anomalies).fill(null).map((_, i) => {
          const {start, end} = randomDate(START_DATE.valueOf()+i*range, START_DATE.valueOf()+(i+1)*range)
          return {
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            score: Math.random()*100,
          }
        }),
      }
    })
      // {
      //   "key": "key1",
      //   "anomalies": [
      //     {
      //       "start_date": "2018-11-20T00:00:00Z",
      //       "end_date": "2018-11-21T00:00:00Z",
      //       "score": 25,
      //     },
      //   ],
      // },
      // {
      //   "key": "key10",
      //   "anomalies": []
      // },
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
    colors: arrayOf(shape({})),
}
