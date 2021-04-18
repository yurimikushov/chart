import Canvas2D from './Canvas2D'
import { CHART_DEFAULT_SIZE, CHART_DEFAULT_COLORS } from './constants'
import { convertToMinMaxFormat, throttle, minMax, isOverRect } from './utils'

class ColumnChart {
  constructor({ title, data, size, colors }) {
    this.title = title
    this.data = convertToMinMaxFormat(data)
    this.initSize(size)

    this.canvas = new Canvas2D(this.size)

    this.initColors(colors)

    this.fontSizes = {
      title: 18,
      label: 14,
    }

    this.paddings = {
      top: this.size.height * 0.2,
      bottom: this.size.height * 0.07,
      left: this.size.width * 0.01 + this.getMaxValueWidth() * 1.2,
      right: this.size.width * 0.01,
    }

    this.chartSize = {
      height: this.size.height - this.paddings.top - this.paddings.bottom,
      width: this.size.width - this.paddings.left - this.paddings.right,
    }
  }

  initSize(size) {
    this.size = { ...CHART_DEFAULT_SIZE }

    if (!size) {
      return
    }

    for (let key in size) {
      this.size[key] = size[key]
    }
  }

  initColors(colors) {
    this.colors = { ...CHART_DEFAULT_COLORS }

    if (!colors) {
      return
    }

    for (let key in colors) {
      this.colors[key] = colors[key]
    }
  }

  mount(container) {
    this.canvas.mount(container)

    this.mouse = {
      x: -1,
      y: -1,
    }

    this.mouseMoveHandler = throttle(({ clientX, clientY }) => {
      this.mouse = {
        x: clientX,
        y: clientY,
      }

      requestAnimationFrame(this.draw.bind(this))
    }, 42)

    window.addEventListener('mousemove', this.mouseMoveHandler)

    this.draw()
  }

  unmount() {
    window.removeEventListener('mousemove', this.mouseMoveHandler)
    this.canvas.unmount()
  }

  draw() {
    this.clear()
    this.fillBackground()
    this.drawTitle()
    this.drawYAxises()
    this.drawXAxises()
    this.drawColumns()
  }

  clear() {
    this.canvas.clear()
  }

  fillBackground() {
    this.canvas.setBackgroundColor(this.colors.background)
  }

  drawTitle() {
    const paddingTop = (this.paddings.top - this.fontSizes.title) / 2

    this.canvas.drawText({
      text: this.title,
      x: this.size.width / 2,
      y: this.fontSizes.title + paddingTop,
      font: `${this.fontSizes.title}px serif`,
      color: this.colors.title,
      align: 'center',
      baseline: 'alphabetic',
    })
  }

  drawYAxises() {
    const gap = this.chartSize.width / this.data.length

    for (let i = 0; i <= this.data.length; i++) {
      this.canvas.drawYLine({
        x: i * gap + this.paddings.left,
        y: this.paddings.top - 5,
        height: this.chartSize.height + this.paddings.top + 5,
        color: this.colors.axis,
      })
    }
  }

  drawXAxises() {
    // FIXME: should get rid of constant number (30)
    const xAxisesCount = Math.floor(this.chartSize.height / 30)

    const maxLabelWidth = this.getMaxValueWidth()
    const gap = this.chartSize.height / xAxisesCount
    const [minValue, maxValue] = minMax(this.data)
    const step = (maxValue - minValue) / xAxisesCount

    for (let i = 0; i <= xAxisesCount; i++) {
      this.canvas.drawXLine({
        x: maxLabelWidth * 1.25,
        y: i * gap + this.paddings.top,
        width: this.size.width,
        color: this.colors.axis,
      })

      this.canvas.drawText({
        text: (maxValue - step * i).toFixed(),
        x: maxLabelWidth * 1.15,
        y: i * gap + this.paddings.top,
        font: `${this.fontSizes.label}px serif`,
        color: this.colors.label,
        align: 'end',
        baseline: 'middle',
      })
    }
  }

  drawColumns() {
    if (this.data.length === 0) {
      return
    }

    const [minValue, maxValue] = minMax(this.data)

    const gap = this.chartSize.width * 0.02

    for (let i = 0; i < this.data.length; i++) {
      const { label, min, max, color } = this.data[i]

      const percentageOfChartHeight = (max - min) / (maxValue - minValue)
      const columnHeight = percentageOfChartHeight * this.chartSize.height
      const columnWidth = this.chartSize.width / this.data.length

      const columnX = columnWidth * i + gap / 2 + this.paddings.left
      const columnY =
        ((maxValue - max) / (maxValue - minValue)) * this.chartSize.height +
        this.paddings.top

      const { left, top } = this.canvas.getBoundingClientRect()

      const isMouseOver = isOverRect(
        this.mouse.x - left,
        this.mouse.y - top,
        columnX,
        columnY,
        columnWidth - gap,
        columnHeight
      )

      this.canvas.drawRect({
        x: columnX,
        y: columnY,
        width: columnWidth - gap,
        height: columnHeight,
        color,
        shadowBlur: isMouseOver ? 10 : 0,
      })

      const columnLabelX =
        columnWidth * i + columnWidth / 2 + this.paddings.left
      const columnLabelY =
        this.chartSize.height +
        this.paddings.top +
        this.paddings.bottom / 2 +
        this.fontSizes.label / 2

      this.canvas.drawText({
        text: label,
        x: columnLabelX,
        y: columnLabelY,
        font: `${this.fontSizes.label}px serif`,
        color: this.colors.label,
        align: 'center',
        baseline: 'alphabetic',
      })
    }
  }

  getMaxValueWidth() {
    let maxValueLength = 0
    let valueWithMaxLength = ''

    this.data.forEach((column) => {
      if (maxValueLength < column.max.toString().length) {
        valueWithMaxLength = column.max
        maxValueLength = column.max.toString().length
      }

      if (maxValueLength < column.min.toString().length) {
        valueWithMaxLength = column.min
        maxValueLength = column.min.toString().length
      }
    })

    return this.canvas.getTextWidth(
      valueWithMaxLength,
      `${this.fontSizes.label}px serif`
    )
  }
}

export { ColumnChart }
