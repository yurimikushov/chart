import { createCanvas, maxTextWidth } from './utils'

class ColumnChart {
  constructor(container, { title, data, size }) {
    this.$container = container
    this.title = title
    this.data = data
    this.size = size

    this.canvas = createCanvas(this.size)
    this.ctx = this.canvas.getContext('2d')

    this.colors = this.getColors()
    this.fontSizes = this.getFontSizes()

    this.paddings = this.getPaddings()
    this.chartSize = this.getChartSize()

    this.render()
  }

  getColors() {
    return {
      background: '#fff',
      title: '#000',
      label: '#5c5c5c',
      axis: '#00000050',
    }
  }

  getFontSizes() {
    return {
      title: 18,
      label: 14,
    }
  }

  getPaddings() {
    const maxLabelWidth = maxTextWidth(
      this.fontSizes.label,
      this.data.map((column) => column.label.length)
    )

    return {
      top: this.size.height * 0.2,
      bottom: this.size.height * 0.07,
      left: this.size.width * 0.01 + maxLabelWidth + 25,
      right: this.size.width * 0.01,
    }
  }

  getChartSize() {
    return {
      height: this.size.height - this.paddings.top - this.paddings.bottom,
      width: this.size.width - this.paddings.left - this.paddings.right,
    }
  }

  render() {
    this.$container.append(this.canvas)
    this.draw()
  }

  draw() {
    this.fillBackground()
    this.drawYAxises()
    this.drawXAxises()
    this.drawTitle()
    this.drawColumns()
  }

  fillBackground() {
    this.ctx.fillStyle = this.colors.background
    this.ctx.fillRect(0, 0, this.size.width, this.size.height)
  }

  drawTitle() {
    const topPadding = (this.paddings.top - this.fontSizes.title) / 2

    this.ctx.fillStyle = this.colors.title
    this.ctx.font = `${this.fontSizes.title}px serif`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'alphabetic'
    this.ctx.fillText(
      this.title,
      this.size.width / 2,
      this.fontSizes.title + topPadding
    )
  }

  drawYAxises() {
    const axisCount = 5
    const axisesGap = this.chartSize.width / axisCount

    for (let i = 0; i <= axisCount; i++) {
      this.drawYAxis({
        x: i * axisesGap + this.paddings.left,
        y: this.paddings.top - 5,
        height: this.chartSize.height + this.paddings.top + 5,
      })
    }
  }

  drawYAxis({ x, y, height }) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x, height)
    this.ctx.strokeStyle = this.colors.axis
    this.ctx.stroke()
  }

  drawXAxises() {
    const axisesGap = this.chartSize.height / this.data.length

    const maxValue = Math.max(...this.data.map((column) => column.value))
    const step = maxValue / this.data.length

    for (let i = 0; i <= this.data.length; i++) {
      this.drawXAxis({
        label: (maxValue - i * step).toFixed(),
        x: 10,
        y: i * axisesGap + this.paddings.top,
        width: this.size.width,
      })
    }
  }

  drawXAxis({ label, x, y, width }) {
    const maxLabelWidth = maxTextWidth(
      this.fontSizes.label,
      this.data.map((column) => column.label.length)
    )

    this.ctx.beginPath()
    this.ctx.moveTo(x + maxLabelWidth * 2, y)
    this.ctx.lineTo(width, y)
    this.ctx.strokeStyle = this.colors.axis
    this.ctx.stroke()

    this.ctx.fillStyle = this.colors.label
    this.ctx.font = `${this.fontSizes.label}px serif`
    this.ctx.textAlign = 'end'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(label, maxLabelWidth * 2 + 5, y)
  }

  drawColumns() {
    if (this.data.length === 0) {
      return
    }

    const values = this.data.map((column) => column.value)
    const maxValue = Math.max(...values)

    const gap = this.chartSize.width * 0.02

    for (let i = 0; i < this.data.length; i++) {
      const { label, value, color } = this.data[i]

      const columnHeight = value / (maxValue / this.chartSize.height)
      const columnWidth = this.chartSize.width / values.length

      this.ctx.fillStyle = color
      this.ctx.fillRect(
        columnWidth * i + gap / 2 + this.paddings.left,
        this.chartSize.height - columnHeight + this.paddings.top,
        columnWidth - gap,
        columnHeight
      )

      this.ctx.fillStyle = this.colors.label
      this.ctx.font = `${this.fontSizes.label}px serif`
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'alphabetic'
      this.ctx.fillText(
        label,
        columnWidth * i + columnWidth / 2 + this.paddings.left,
        this.chartSize.height +
          this.paddings.top +
          this.paddings.bottom / 2 +
          this.fontSizes.label / 2
      )
    }
  }
}

export { ColumnChart }
