import Canvas2D from './Canvas2D'
import { throttle, isOverRect } from './utils'

class ColumnChart {
  constructor({ title, data, size }) {
    this.title = title
    this.data = data
    this.size = size

    this.canvas = new Canvas2D(size)

    this.colors = {
      background: '#fff',
      title: '#000',
      label: '#5c5c5c',
      axis: '#00000050',
    }

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
    const maxLabelWidth = this.getMaxValueWidth()
    const gap = this.chartSize.height / this.data.length
    const maxValue = Math.max(...this.data.map((column) => column.value))
    const step = maxValue / this.data.length

    for (let i = 0; i <= this.data.length; i++) {
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

    const values = this.data.map((column) => column.value)
    const maxValue = Math.max(...values)

    const gap = this.chartSize.width * 0.02

    for (let i = 0; i < this.data.length; i++) {
      const { label, value, color } = this.data[i]

      const columnHeight = value / (maxValue / this.chartSize.height)
      const columnWidth = this.chartSize.width / values.length

      const columnX = columnWidth * i + gap / 2 + this.paddings.left
      const columnY = this.chartSize.height - columnHeight + this.paddings.top

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
      if (maxValueLength < column.value.toString().length) {
        valueWithMaxLength = column.value
        maxValueLength = column.value.toString().length
      }
    })

    return this.canvas.getTextWidth(
      valueWithMaxLength,
      `${this.fontSizes.label}px serif`
    )
  }
}

export { ColumnChart }
