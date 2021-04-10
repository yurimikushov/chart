class ColumnChart {
  constructor(container, { title, data, size }) {
    this.$container = container
    this.title = title
    this.data = data
    this.size = size

    this.topPadding = this.size.height * 0.2
    this.bottomPadding = this.size.height * 0.1
    this.leftPadding = this.size.width * 0.01
    this.rightPadding = this.size.width * 0.01

    this.chartHeight = this.size.height - this.topPadding - this.bottomPadding
    this.chartWidth = this.size.width - this.leftPadding - this.rightPadding

    this.backgroundColor = '#fff'
    this.titleColor = '#000'
    this.axisColor = '#00000050'

    this.fontSize = {
      title: 18,
    }

    this.canvas = this.createCanvas()
    this.ctx = this.canvas.getContext('2d')

    this.render()
  }

  createCanvas() {
    const { height, width } = this.size

    const canvas = document.createElement('canvas')

    canvas.height = height
    canvas.width = width

    return canvas
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
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(0, 0, this.size.width, this.size.height)
  }

  drawTitle() {
    const topPadding = (this.topPadding - this.fontSize.title) / 2

    this.ctx.fillStyle = this.titleColor
    this.ctx.font = `${this.fontSize.title}px serif`
    this.ctx.textAlign = 'center'
    this.ctx.fillText(
      this.title,
      this.size.width / 2,
      this.fontSize.title + topPadding
    )
  }

  drawYAxises() {
    const axisCount = 5
    const axisesGap = this.chartHeight / axisCount

    for (let i = 0; i <= axisCount; i++) {
      this.drawYAxis({
        x: 0,
        y: i * axisesGap + this.topPadding,
        width: this.size.width,
      })
    }
  }

  drawYAxis({ x, y, width }) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(width, y)
    this.ctx.strokeStyle = this.axisColor
    this.ctx.stroke()
  }

  drawXAxises() {
    const axisCount = this.data.length
    const axisesGap = this.chartWidth / axisCount

    for (let i = 0; i <= axisCount; i++) {
      this.drawXAxis({
        x: i * axisesGap + this.leftPadding,
        y: this.topPadding - 5,
        height: this.chartHeight + this.topPadding + 5,
      })
    }
  }

  drawXAxis({ x, y, height }) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x, height)
    this.ctx.strokeStyle = this.axisColor
    this.ctx.stroke()
  }

  drawColumns() {
    if (this.data.length === 0) {
      return
    }

    const values = this.data.map((column) => column.value)
    const maxValue = Math.max(...values)

    const gap = this.chartWidth * 0.02

    for (let i = 0; i < this.data.length; i++) {
      const { label, value, color } = this.data[i]
      const columnHeight = value / (maxValue / this.chartHeight)
      const columnWidth = this.chartWidth / values.length

      this.ctx.fillStyle = color
      this.ctx.fillRect(
        columnWidth * i + gap / 2 + this.leftPadding,
        this.chartHeight - columnHeight + this.topPadding,
        columnWidth - gap,
        columnHeight
      )
    }
  }
}

export { ColumnChart }
