/** @flow */
import * as React from 'react';
// import cn from 'classnames';

import _ from 'lodash'
import { TimeRange, DygraphClass, Constructable } from 'src/types';
import D from 'src/external/dygraph'
import ReactResizeDetector from 'react-resize-detector'
import {color, rgb} from 'd3-color'

// import Dygraph from 'src/shared/components/Dygraph';

import 'src/loudml/styles/anomaly.scss';
import moment from 'moment'
import { CHAR_PIXELS } from 'src/shared/graphs/helpers';
import Crosshair from 'src/shared/components/Crosshair';
import {ColorNumber} from 'src/types/colors'

const Dygraphs = D as Constructable<DygraphClass>

// const LEFT_COLOR_FROM = hexToRgb('#471061');
// const LEFT_COLOR_TO = hexToRgb('#BC3959');
// const TOP_COLOR_FROM = hexToRgb('#000000');
// const TOP_COLOR_TO = hexToRgb('#333333');

interface Props {
  timeRange: TimeRange
  groupBy: string
  data: any[]
  setResolution: (resolution: number) => void
  colors: ColorNumber[]
}

interface State {
  // transformedData: any[[]]
  xAxisRange: [number, number]
}

const transformData = (data: any[]) => {
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
  const serie = _.uniq(dates).sort((a: number, b: number) => (a-b))
  const series = serie.map(t => {
    const time = moment(t)
    const values = data.reduce((r, d, i) => {
      const between = d.anomalies.some(a => (time.isBetween(a.start_date, a.end_date, null, '[]')))
      const value = (between?size-i:null)
      return [...r, value]
    }, [])
    return [time.toDate(), ...values]
  })
  return {
    transformedData: series,
    labels: ['time', ...data.reduce((r, d) => ([...r, d.key]), [])],
  }
}


export default class AnomalySwimlane extends React.PureComponent<Props, State> {

  private graphRef: React.RefObject<HTMLDivElement>
  private dygraph: DygraphClass

  constructor(props, context) {
    super(props, context);

    this.state = {
      xAxisRange: [0, 0],
      // transformedData: [[]],
    };

    this.graphRef = React.createRef<HTMLDivElement>()
  }

  public componentDidMount() {
    const {
      // axes: {y, y2},
      // isGraphFilled: fillGraph,
      // isBarGraph,
      options,
      // labels,
      data,
    } = this.props

    const {transformedData, labels} = transformData(data)

    const defaultOptions = {
      ...options,
      labels,
      drawGrid: false,
      // highlightCircleSize: 0,
      plotter: this.keyPlotter,
//      fillGraph,
      file: transformedData, // this.timeSeries,
      // ylabel: this.getLabel('y'),
//      logscale: y.scale === LOG,
//      colors: LINE_COLORS,
//      series: this.colorDygraphSeries,
      axes: {
        y: {
          valueRange: [0, data.length+1],  // this.getYRange(timeSeries),
          // ticker: () => labels.slice(1).map((l, i) => ({v: i, label: l})),
          // axisLabelWidth: this.labelWidth,
          // axisLabelFormatter: (
          //   yval: number,
          //   __,
          //   opts: (name: string) => number
          // ) => numberValueFormatter(yval, opts, y.prefix, y.suffix),
          // labelsKMB: y.base === BASE_10,
          // labelsKMG2: y.base === BASE_2,
        },
        // y2: {
        //   valueRange: getRange(timeSeries, y2.bounds),
        // },
      },
      // zoomCallback: (lower: number, upper: number) =>
      //   this.handleZoom(lower, upper),
      // drawCallback: () => this.handleDraw(),
    }

    this.dygraph = new Dygraphs(this.graphRef.current, transformedData, {
      ...defaultOptions,
      // ...OPTIONS,
      ...options,
    })

    const {w} = this.dygraph.getArea()
    this.props.setResolution(w)
    this.setState({
      xAxisRange: this.dygraph.xAxisRange(),
      // transformedData,
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
      // labels,
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

    const {transformedData, labels} = transformData(this.props.data)

    const labelWidth = labels[1].length * CHAR_PIXELS
    const maxRange = this.props.data.length+1
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
      file: transformedData,
      drawGrid: false,
      // highlightCircleSize: 0,
      plotter: this.keyPlotter,
      // logscale: y.scale === LOG,
      // ylabel: this.getLabel('y'),
      axes: {
        y: {
          valueRange: [0, maxRange],
      //     axisLabelFormatter: (
      //       yval: number
      // //       __,
      // //       opts: (name: string) => number
      //     ) => labels[yval+1],
          // ticker: () => labels.slice(1).map((l, i) => ({v: i+1, label: l})),
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
    }

    dygraph.updateOptions(updateOptions)

    const {w} = this.dygraph.getArea()
    this.props.setResolution(w)
    this.resize()
  }

  public render() {
    // const {
    //   transformedData
    // } = this.state

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
                  cellID={cellID}
                  dygraph={this.dygraph}
                  onHide={this.handleHideLegend}
                  onShow={this.handleShowLegend}
                  onMouseEnter={this.handleMouseEnterLegend}
                /> */}
                <Crosshair
                  dygraph={this.dygraph}
                  staticLegendHeight={20}
                />
              </div>
            )}
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
      data,
    } = this.props

    const maxLength = data.reduce((r, d) => (Math.max(r, d.key.length)), 0)
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

    const {data, colors} = this.props

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
      // push new
      return [
        ...a,
        current,
        {start: null, end: null}
      ]
    }, [{start_x: NaN, end_x: NaN}])
    plotterMap.forEach(({start, end}) => {
      if (end) {
        const width = end.canvasx - start.canvasx
        const key = data
          .find(d => (d.key === start.name))
        const anomalie = key.anomalies.find(a => (
          moment(start.xval).isBetween(a.start_date, a.end_date, null, '[]')))
        const score = anomalie.score
        const scoreColor = (score<50
          ?pickHex(colors[0].hex, colors[1].hex, (score/100)*2)
          :pickHex(colors[1].hex, colors[2].hex, (score-50)/100*2))
        // const scoreColor = color(e.color)
        ctx.fillStyle = scoreColor.darker();
        ctx.fillRect(start.canvasx, start.canvasy-5, width, 10);
        ctx.strokeStyle = scoreColor;
        ctx.strokeRect(start.canvasx, start.canvasy-5, width, 10);
      }
    });
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
