import { createCanvas } from './utils'

class ColumnChart {
  constructor(container, { title, data, size }) {
    this.$container = container
    this.title = title
    this.data = data
    this.size = size

    this.paddings = {
      top: this.size.height * 0.2,
      bottom: this.size.height * 0.1,
      left: this.size.width * 0.01,
      right: this.size.width * 0.01,
    }

    this.chartSize = {
      height: this.size.height - this.paddings.top - this.paddings.bottom,
      width: this.size.width - this.paddings.left - this.paddings.right,
    }

    this.colors = {
      background: '#fff',
      title: '#000',
      axis: '#00000050',
    }

    this.fontSizes = {
      title: 18,
    }

    this.canvas = createCanvas(this.size)
    this.ctx = this.canvas.getContext('2d')

    this.render()
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
    this.ctx.fillText(
      this.title,
      this.size.width / 2,
      this.fontSizes.title + topPadding
    )
  }

  drawYAxises() {
    const axisCount = 5
    const axisesGap = this.chartSize.height / axisCount

    for (let i = 0; i <= axisCount; i++) {
      this.drawYAxis({
        x: 0,
        y: i * axisesGap + this.paddings.top,
        width: this.size.width,
      })
    }
  }

  drawYAxis({ x, y, width }) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(width, y)
    this.ctx.strokeStyle = this.colors.axis
    this.ctx.stroke()
  }

  drawXAxises() {
    const axisCount = this.data.length
    const axisesGap = this.chartSize.width / axisCount

    for (let i = 0; i <= axisCount; i++) {
      this.drawXAxis({
        x: i * axisesGap + this.paddings.left,
        y: this.paddings.top - 5,
        height: this.chartSize.height + this.paddings.top + 5,
      })
    }
  }

  drawXAxis({ x, y, height }) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x, height)
    this.ctx.strokeStyle = this.colors.axis
    this.ctx.stroke()
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
    }
  }
}

export { ColumnChart }
