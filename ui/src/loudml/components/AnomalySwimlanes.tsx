/** @flow */
import * as React from 'react';
// import cn from 'classnames';

import _ from 'lodash'
import { TimeRange, DygraphClass, Constructable } from 'src/types';
import D from 'src/external/dygraph'
import DygraphLegend from 'src/shared/components/DygraphLegend'

import ReactResizeDetector from 'react-resize-detector'
import {color, rgb} from 'd3-color'

// import Dygraph from 'src/shared/components/Dygraph';

import 'src/loudml/styles/anomaly.scss';
import { CHAR_PIXELS } from 'src/shared/graphs/helpers';
import {ColorNumber} from 'src/types/colors'
import SwimlanesLegend from 'src/loudml/components/SwimlanesLegend'
import moment from 'moment'
import SwimlanesCrosshair from 'src/loudml/components/SwimlanesCrosshair';

const Dygraphs = D as Constructable<DygraphClass>
// const LEFT_COLOR_FROM = hexToRgb('#471061');
// const LEFT_COLOR_TO = hexToRgb('#BC3959');
// const TOP_COLOR_FROM = hexToRgb('#000000');
// const TOP_COLOR_TO = hexToRgb('#333333');

interface Props {
  timeRange: TimeRange
  groupBy: string
  timeSeries: any[]
  labels: any[]
  anomalies: any[]
  setResolution: (resolution: number) => void
  colors: ColorNumber[]
}

interface State {
  // transformedData: any[[]]
  staticLegendHeight: number
  xAxisRange: [number, number]
}

export default class AnomalySwimlane extends React.PureComponent<Props, State> {

  private graphRef: React.RefObject<HTMLDivElement>
  private dygraph: DygraphClass

  constructor(props, context) {
    super(props, context);

    this.state = {
      staticLegendHeight: 0,
      xAxisRange: [0, 0],
    };

    this.graphRef = React.createRef<HTMLDivElement>()
  }

  public componentDidMount() {
    const {
      // axes: {y, y2},
      // isGraphFilled: fillGraph,
      // isBarGraph,
      options,
      labels,
    } = this.props

    const timeSeries = this.timeSeries

    const maxRange = labels.length+1

    const defaultOptions = {
      ...options,
      labels,
      // drawGrid: false,
      // highlightCircleSize: 0,
      highlightSeriesOpts: { strokeWidth: 2 },
      highlightSeriesBackgroundAlpha: 1,
      labelsDiv: 'legend',
      labelsSeparateLines: true,
      plotter: this.keyPlotter,
//      fillGraph,
      file: timeSeries,
      // ylabel: this.getLabel('y'),
//      logscale: y.scale === LOG,
//      colors: LINE_COLORS,
//      series: this.colorDygraphSeries,
      axes: {
        y: {
          valueRange: [0, maxRange],  // this.getYRange(timeSeries),
          ticker: () => labels.slice(1).map((_, i) => ({v: i+1, label: `key${i+1}`})),
          // axisLabelWidth: this.labelWidth,
          // axisLabelFormatter: (
          //   yval: number,
          // ) => (yval<labels.length&&yval>0?`key${yval}`:''),
          // labelsKMB: y.base === BASE_10,
          // labelsKMG2: y.base === BASE_2,
        },
        // y2: {
        //   valueRange: getRange(timeSeries, y2.bounds),
        // },
      },
      // zoomCallback: (lower: number, upper: number) =>
      //   this.handleZoom(lower, upper),
      drawCallback: () => this.handleDraw(),
      legendFormatter: this.legendFormatter,
    }

    this.dygraph = new Dygraphs(this.graphRef.current, this.timeSeries, {
      ...defaultOptions,
      // ...OPTIONS,
      ...options,
    })

    const {w} = this.dygraph.getArea()
    this.props.setResolution(w)
    this.setState({
      xAxisRange: this.dygraph.xAxisRange(),
    })
  }

  // public componentWillReceiveProps(nextProps: Props) {
  //   if (!_.isEqual(nextProps.data, this.props.data) {
  //     const {transformedData} = transformData(nextProps.data)
  //     this.setState({transformedData})
  //   }
  // }

  public componentWillUnmount() {
    if (this.dygraph) {
      this.dygraph.destroy()
      delete this.dygraph
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      labels,
      // axes: {y, y2},
      options,
      // isBarGraph,
    } = this.props

    const dygraph = this.dygraph

    if (!dygraph) {
      throw new Error(
        'Dygraph not configured in time; this should not be possible!'
      )
    }

    // const {transformedData, labels} = this.state  // transformData(this.props.data)

    const labelWidth = labels[1].length * CHAR_PIXELS
    const timeSeries = this.timeSeries
    const maxRange = labels.length+1
    // const timeRangeChanged = !_.isEqual(
    //   prevProps.timeRange,
    //   this.props.timeRange
    // )

    // if (this.dygraph.isZoomed() && timeRangeChanged) {
    //   this.dygraph.resetZoom()
    // }

    const updateOptions = {
      ...options,
      labels,
      file: timeSeries,
      // drawGrid: false,
      labelsDiv: 'legend',
      labelsSeparateLines: true,
      // highlightCircleSize: 0,
      highlightSeriesOpts: { strokeWidth: 2 },
      highlightSeriesBackgroundAlpha: 1,
      plotter: this.keyPlotter,
      // logscale: y.scale === LOG,
      // ylabel: this.getLabel('y'),
      axes: {
        y: {
          valueRange: [0, maxRange],
          // axisLabelFormatter: (
          //   yval: number
          // ) => (yval<labels.length&&yval>0?`key${yval}`:''),
          ticker: () => labels.slice(1).map((_, i) => ({v: i+1, label: `key${i+1}`})),
          // axisLabelWidth: this.labelWidth,
      //     labelsKMB: y.base === BASE_10,
      //     labelsKMG2: y.base === BASE_2,
        },
      //   y2: {
      //     valueRange: getRange(timeSeries, y2.bounds),
      //   },
      },
      // colors: LINE_COLORS,
      // series: this.colorDygraphSeries,
      // plotter: isBarGraph ? barPlotter : null,
      legendFormatter: this.legendFormatter,
    }

    dygraph.updateOptions(updateOptions)

    const {w} = this.dygraph.getArea()
    this.props.setResolution(w)
    this.resize()
  }

  public render() {
    const {
      staticLegendHeight,
    } = this.state

    return (
      <div className="graph-container" style={this.containerStyle}>
        <div className="dygraph">
          <div
            className="dygraph-child"
            // onMouseMove={this.handleShowLegend}
            // onMouseLeave={this.handleHideLegend}
            >
            {this.dygraph && (
              <div className="dygraph-addons">
                {/* <DygraphLegend
                  cellID={'4'}
                  dygraph={this.dygraph}
                  onHide={this.handleHideLegend}
                  onShow={this.handleShowLegend}
                  onMouseEnter={this.handleMouseEnterLegend}
                />
                <SwimlanesCrosshair
                  dygraph={this.dygraph}
                  staticLegendHeight={staticLegendHeight}
                /> */}
              </div>
            )}
            {/* <SwimlanesLegend
              dygraph={this.dygraph}
              height={staticLegendHeight}
              onUpdateHeight={this.handleUpdateStaticLegendHeight}
            /> */}
            {/* <SwimlanesLegend
              cellID={'4'}
              dygraph={this.dygraph}
              height={staticLegendHeight}
              // onHide={this.handleHideLegend}
              // onShow={this.handleShowLegend}
              // onMouseEnter={this.handleMouseEnterLegend}
            /> */}
            <div
              className="dygraph-child-container"
              ref={this.graphRef}
              style={this.dygraphStyle}
            />
            <ReactResizeDetector
              handleWidth={true}
              handleHeight={true}
              onResize={this.resize}
            />
          </div>
        </div>
        {/* {JSON.stringify(this.timeSeries)} */}
      </div>
    )
  }

  // public componentDidMount() {
  //   const {
  //     timeRange
  //   } = this.props

  //   const transformedData = transformAnomalyData(data)

  //   this.setState({transformedData})
  // }

  private get timeSeries() {
    const {timeSeries} = this.props
    // Avoid 'Can't plot empty data set' errors by falling back to a
    // default dataset that's valid for Dygraph.
    return timeSeries.length ? timeSeries : [[0]]
  }

  private get containerStyle(): React.CSSProperties {

    return {
      height: '250px',
    }

  }

  private get dygraphStyle(): React.CSSProperties {

    return {
      width: 'calc(100% - 32px)',
      height: 'calc(100% - 16px)',
      position: 'absolute',
      top: '8px',
      zIndex: 2,
    }

  }

  private get labelWidth() {
    const {
      labels,
    } = this.props

    const maxLength = labels.reduce((l, r) => (Math.max(r, l.length)), 0)
    return (maxLength * CHAR_PIXELS)
  }

  private keyPlotter = (e) => {
    function pickHex(color1, color2, weight) {
      const w1 = weight;
      const w2 = 1 - w1;
      const color1rgb = color(color1)
      const color2rgb = color(color2)
      const r = Math.round(color1rgb.r * w1 + color2rgb.r * w2)
      const g = Math.round(color1rgb.g * w1 + color2rgb.g * w2)
      const b = Math.round(color1rgb.b * w1 + color2rgb.b * w2)
      return rgb(r, g, b)
    }

    const {colors, anomalies} = this.props

    // console.log('plot', e)

    const ctx = e.drawingContext;
    const points = e.points;

    // Do the actual plotting.
    const plotterMap = points.reduce((a, p) => {
      const current = a.pop()
      const y = p.canvasy
      if (!Number.isNaN(y)) {
        // update current
        const start = (current.start?current.start:p)
        return [
          ...a,
          {
            ...current,
            start,
            end: p,
          }
        ]
      }
      if (current.start) {
        // push new
        return [
          ...a,
          current,
          {start: null, end: null}
        ]
      }
      // leave unchanged
      return [
        ...a,
        current
      ]
    }, [{start: null, end: null}])
    plotterMap.forEach(({start, end}) => {
      if (end) {
        const width = end.canvasx - start.canvasx
        const key = anomalies
          .find(d => (d.key === start.name))
        const anomalie = key.anomalies.find(a => (
          moment(start.xval).isBetween(a.start_date, a.end_date, null, '[]')))
        const score = anomalie.score
        const scoreColor = (score<50
          ?pickHex(colors[1].hex, colors[0].hex, (score/100)*2)
          :pickHex(colors[2].hex, colors[1].hex, (score-50)/100*2))
        // const scoreColor = color(e.color)
        ctx.fillStyle = scoreColor.darker();
        ctx.fillRect(start.canvasx, start.canvasy-5, width, 10);
        ctx.strokeStyle = scoreColor;
        ctx.strokeRect(start.canvasx, start.canvasy-5, width, 10);
      }
    });
  }
  
  private legendFormatter = (data) => {
    if (data.x == null) {
      // This happens when there's no selection and {legend: 'always'} is set.
      return '<br>' + data.series.map(series => (series.dashHTML + ' ' + series.labelHTML)).join('<br>');
    }

    const {anomalies} = this.props
    
    let html = this.dygraph.getLabels()[0] + ': ' + data.xHTML; // time
    data.series.forEach(series => {
      if (!series.isVisible||!series.isHighlighted) { return }     // only highlighted
      const time = moment(data.x)
      const format = 'YYYY/MM/DD HH:mm:ss.SSS'
      const anomalie = anomalies[data.series.length-series.y].anomalies.find(a => (time.isBetween(a.start_date, a.end_date, null, '[]')))
      const labeledData = 'key' + series.yHTML + ': ' + anomalie.score.toFixed(2) + ' from: ' + moment(anomalie.start_date).format(format) + ' to: ' + moment(anomalie.end_date).format(format)
      html += '<br>' + series.dashHTML + ' ' + labeledData;
    });
    return html;
  }

  private handleDraw = () => {
    if (!this.dygraph) {
      return
    }

    const {xAxisRange} = this.state
    const newXAxisRange = this.dygraph.xAxisRange()

    if (!_.isEqual(xAxisRange, newXAxisRange)) {
      this.setState({xAxisRange: newXAxisRange})
    }
  }

  private handleUpdateStaticLegendHeight = (staticLegendHeight: number) => {
    this.setState({staticLegendHeight})
  }

  private handleHideLegend = () => {
    this.setState({isMouseInLegend: false})
    this.props.handleSetHoverTime(NULL_HOVER_TIME)
  }

  private handleShowLegend = (e: MouseEvent<HTMLDivElement>): void => {
    const {isMouseInLegend} = this.state

    if (isMouseInLegend) {
      return
    }

    const newTime = this.eventToTimestamp(e)
    this.props.handleSetHoverTime(newTime)
  }

  private handleMouseEnterLegend = () => {
    // this.setState({isMouseInLegend: true})
  }

  private resize = () => {
    this.dygraph.resizeElements_()
    this.dygraph.predraw_()
    this.dygraph.resize()
  }
  
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors(color1, color2, amount) {
  const weight1 = amount;
  const weight2 = 1 - amount;

  const r = Math.round(weight1 * color1.r + weight2 * color2.r);
  const g = Math.round(weight1 * color1.g + weight2 * color2.g);
  const b = Math.round(weight1 * color1.b + weight2 * color2.b);

  return {r, g, b};
}

const GraphLoadingDots = () => (
  <div className="graph-panel__refreshing">
    <div />
    <div />
    <div />
  </div>
)
