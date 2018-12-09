import React, {PureComponent, ChangeEvent} from 'react'
import {connect} from 'react-redux'

import _ from 'lodash'
import classnames from 'classnames'
import uuid from 'uuid'

import * as actions from 'src/dashboards/actions'
import {SeriesLegendData} from 'src/types/dygraphs'

import {makeLegendStyles} from 'src/shared/graphs/helpers'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {NO_CELL} from 'src/shared/constants'
import {DygraphClass} from 'src/types'

interface Props {
  hoverTime: number
  dygraph: DygraphClass
  cellID: string
  onHide: () => void
  onShow: (e: MouseEvent) => void
  activeCellID: string
  setActiveCell: (cellID: string) => void
  onMouseEnter: () => void
}

interface LegendData {
  x: number
  series: SeriesLegendData[]
  xHTML: string
}

interface State {
  legend: LegendData
  sortType: string
  isAscending: boolean
  filterText: string
  isFilterVisible: boolean
  legendStyles: object
  pageX: number | null
  cellID: string
}

@ErrorHandling
class SwimlanesLegend extends PureComponent<Props, State> {
  private legendRef: HTMLElement | null = null

  constructor(props: Props) {
    super(props)

    this.props.dygraph.updateOptions({
      legendFormatter: this.legendFormatter,
      highlightCallback: this.highlightCallback,
      unhighlightCallback: this.unhighlightCallback,
    })

    this.state = {
      legend: {
        x: null,
        series: [],
        xHTML: '',
      },
      sortType: 'numeric',
      isAscending: false,
      filterText: '',
      legendStyles: {},
      pageX: null,
      cellID: null,
    }
  }

  public componentWillUnmount() {
    if (
      !this.props.dygraph.graphDiv ||
      !this.props.dygraph.visibility().find(bool => bool === true)
    ) {
      this.setState({filterText: ''})
    }
  }

  public render() {
    const {onMouseEnter} = this.props

    return (
      <div
        className={`dygraph-legend ${this.hidden}`}
        ref={el => (this.legendRef = el)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={this.handleHide}
        style={this.styles}
      >
        <div className="dygraph-legend--contents">
          {this.filtered.map(({label, color, yHTML, isHighlighted}) => {
            const seriesClass = isHighlighted
              ? 'dygraph-legend--row highlight'
              : 'dygraph-legend--row'
            return (
              <div key={uuid.v4()} className={seriesClass}>
                <span style={{color}}>{label}</span>
                <figure>{yHTML || 'no value'}</figure>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  private handleHide = (): void => {
    this.props.onHide()
    this.props.setActiveCell(NO_CELL)
  }

  private highlightCallback = (e: MouseEvent) => {
    if (this.props.activeCellID !== this.props.cellID) {
      this.props.setActiveCell(this.props.cellID)
    }

    this.setState({pageX: e.pageX})
    this.props.onShow(e)
  }

  private legendFormatter = (legend: LegendData) => {
    if (!legend.x) {
      return ''
    }

    const {legend: prevLegend} = this.state
    const highlighted = legend.series.find(s => s.isHighlighted)
    const prevHighlighted = prevLegend.series.find(s => s.isHighlighted)

    const yVal = highlighted && highlighted.y
    const prevY = prevHighlighted && prevHighlighted.y

    if (legend.x === prevLegend.x && yVal === prevY) {
      return ''
    }

    this.setState({legend})
    return ''
  }

  private unhighlightCallback = (e: MouseEvent) => {
    const {top, bottom, left, right} = this.legendRef.getBoundingClientRect()

    const mouseY = e.clientY
    const mouseX = e.clientX

    const mouseBuffer = 5
    const mouseInLegendY = mouseY <= bottom && mouseY >= top - mouseBuffer
    const mouseInLegendX = mouseX <= right && mouseX >= left
    const isMouseHoveringLegend = mouseInLegendY && mouseInLegendX

    if (!isMouseHoveringLegend) {
      this.handleHide()
    }
  }

  private get filtered(): SeriesLegendData[] {
    const {legend, sortType, isAscending, filterText} = this.state
    const withValues = legend.series.filter(s => !_.isNil(s.y))
    const sorted = _.sortBy(
      withValues,
      ({y, label}) => (sortType === 'numeric' ? y : label)
    )

    const ordered = isAscending ? sorted : sorted.reverse()
    return ordered.filter(s => s.label.match(filterText))
  }

  private get isAphaSort(): boolean {
    return this.state.sortType === 'alphabetic'
  }

  private get isNumSort(): boolean {
    return this.state.sortType === 'numeric'
  }

  private get isVisible(): boolean {
    const {cellID, activeCellID} = this.props

    return cellID === activeCellID
  }

  private get hidden(): string {
    if (this.isVisible) {
      return ''
    }

    return 'hidden'
  }

  private get styles() {
    const {
      dygraph,
      dygraph: {graphDiv},
      hoverTime,
    } = this.props

    const cursorOffset = 16
    const legendPosition = dygraph.toDomXCoord(hoverTime) + cursorOffset
    return makeLegendStyles(graphDiv, this.legendRef, legendPosition)
  }
}

const mapDispatchToProps = {
  setActiveCell: actions.setActiveCell,
}

const mapStateToProps = ({dashboardUI}) => ({
  activeCellID: dashboardUI.activeCellID,
  hoverTime: +dashboardUI.hoverTime,
})

export default connect(mapStateToProps, mapDispatchToProps)(SwimlanesLegend)
