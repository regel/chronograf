import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Dygraph from 'src/shared/components/Dygraph'
import shallowCompare from 'react-addons-shallow-compare'

import {timeSeriesToDygraph, errorBars} from 'src/loudml/utils/timeSeriesToDygraph'
import { numberValueFormatter } from 'src/utils/formatting';

class ConfidenceGraph extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillMount() {
    const {data, isInDataExplorer} = this.props
    this._timeSeries = errorBars(timeSeriesToDygraph(data, isInDataExplorer))
  }

  componentWillUpdate(nextProps) {
    const {data, activeQueryIndex} = this.props
    if (
      data !== nextProps.data ||
      activeQueryIndex !== nextProps.activeQueryIndex
    ) {
      this._timeSeries = errorBars(timeSeriesToDygraph(
        nextProps.data,
        nextProps.isInDataExplorer
      ))
    }
  }

  render() {
    const {
      // data,
      axes,
      cell,
      title,
      // colors,
      onZoom,
      queries,
      timeRange,
      // cellHeight,
      ruleValues,
      isBarGraph,
      resizeCoords,
      isRefreshing,
      setResolution,
      isGraphFilled,
      // showSingleStat,
      displayOptions,
      staticLegend,
      underlayCallback,
      // overrideLineColors,
      isFetchingInitially,
      hoverTime,
      onSetHoverTime,
    } = this.props

    const {labels, timeSeries, dygraphSeries} = this._timeSeries

    // If data for this graph is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    const valueFormatter = (value, opts, seriesName, dygraph, row, col) => {
        const [lower, mid, upper] = dygraph.getValue(row, col).map(v => (v?numberValueFormatter(v, opts, '', ''):''))
        return `${mid} (${lower}/${upper})`
    }

    const options = {
      ...displayOptions,
      title,
      labels,
      rightGap: 0,
      yRangePad: 10,
      labelsKMB: true,
      fillGraph: false,
      underlayCallback,
      axisLabelWidth: 60,
      drawAxesAtZero: true,
      axisLineColor: '#383846',
      gridLineColor: '#383846',
      connectSeparatedPoints: true,
      customBars: true,
      axes: {
          y: {
              valueFormatter, // : valueFormatter,
          },
          y2: {
            valueFormatter, // : valueFormatter,
          },
      },
      fillAlpha: 0.35,  // 0.15
    }

    /*
    const lineColors = [
      "#284785",
      "#EE1111",
      "#8AE234",
    ]
*/

    const containerStyle = {
      width: 'calc(100% - 32px)',
      height: 'calc(100% - 16px)',
      position: 'absolute',
      top: '8px',
    }

    // const prefix = axes ? axes.y.prefix : ''
    // const suffix = axes ? axes.y.suffix : ''

    return (
      <div className="dygraph graph--hasYLabel" style={{height: '100%'}}>
        {isRefreshing ? <GraphLoadingDots /> : null}
        <Dygraph
          cell={cell}
          axes={axes}
          onZoom={onZoom}
          labels={labels}
          queries={queries}
          options={options}
          timeRange={timeRange}
          isBarGraph={isBarGraph}
          timeSeries={timeSeries}
          ruleValues={ruleValues}
          hoverTime={hoverTime}
          onSetHoverTime={onSetHoverTime}
          resizeCoords={resizeCoords}
          dygraphSeries={dygraphSeries}
          setResolution={setResolution}
          // overrideLineColors={lineColors}
          containerStyle={containerStyle}
          staticLegend={staticLegend}
          isGraphFilled={isGraphFilled}
        >
        </Dygraph>
      </div>
    )
  }
}

const GraphLoadingDots = () => (
  <div className="graph-panel__refreshing">
    <div />
    <div />
    <div />
  </div>
)

const GraphSpinner = () => (
  <div className="graph-fetching">
    <div className="graph-spinner" />
  </div>
)

const {array, arrayOf, bool, func, number, shape, string} = PropTypes

ConfidenceGraph.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

ConfidenceGraph.propTypes = {
  axes: shape({
    y: shape({
      bounds: array,
      label: string,
    }),
    y2: shape({
      bounds: array,
      label: string,
    }),
  }),
  title: string,
  isFetchingInitially: bool,
  isRefreshing: bool,
  underlayCallback: func,
  isGraphFilled: bool,
  isBarGraph: bool,
  staticLegend: bool,
  displayOptions: shape({
    stepPlot: bool,
    stackedGraph: bool,
  }),
  activeQueryIndex: number,
  ruleValues: shape({}),
  timeRange: shape({
    lower: string.isRequired,
  }),
  isInDataExplorer: bool,
  hoverTime: string,
  onSetHoverTime: func,
  setResolution: func,
  cellHeight: number,
  cell: shape(),
  onZoom: func,
  resizeCoords: shape(),
  queries: arrayOf(shape({}).isRequired).isRequired,
  data: arrayOf(shape({}).isRequired).isRequired,
  colors: arrayOf(
    shape({
      type: string.isRequired,
      hex: string.isRequired,
      id: string.isRequired,
      name: string.isRequired,
      value: string.isRequired,
    }).isRequired
  ),
}

export default ConfidenceGraph
