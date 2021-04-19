import Canvas2D from './Canvas2D'
import {
  getSize,
  getColors,
  convertToMinMaxFormat,
  throttle,
  minMax,
  isOverRect,
} from './utils'

class ColumnChart {
  constructor({ title, data, size, colors }) {
    this.title = title
    this.data = convertToMinMaxFormat(data)
    this.size = getSize(size)

    this.canvas = new Canvas2D(this.size)

    this.colors = getColors(colors)

    this.fontSizes = {
      title: this.size.height * 0.065,
      label: this.size.height * 0.05,
    }

    this.paddings = {
      top: this.size.height * 0.2,
      bottom: this.size.height * 0.07,
      left: this.size.width * 0.01 + this.getMaxWidthOfValues() * 1.2,
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
    // FIXME: should get rid of constant number (30)
    const xAxisesCount = Math.floor(this.chartSize.height / 30)

    const maxLabelWidth = this.getMaxWidthOfValues()
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

      this.drawColumn({
        columnWidth,
        columnHeight,
        number: i,
        gap,
        maxValue,
        minValue,
        currentMax: max,
        color,
      })

      this.drawColumnLabel({
        label,
        columnWidth,
        number: i,
      })
    }
  }

  drawColumn({
    columnWidth,
    columnHeight,
    number,
    gap,
    maxValue,
    minValue,
    currentMax,
    color,
  }) {
    const columnX = columnWidth * number + gap / 2 + this.paddings.left
    const columnY =
      ((maxValue - currentMax) / (maxValue - minValue)) *
        this.chartSize.height +
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
  }

  drawColumnLabel({ label, columnWidth, number }) {
    const x = columnWidth * number + columnWidth / 2 + this.paddings.left
    const y =
      this.chartSize.height +
      this.paddings.top +
      this.paddings.bottom / 2 +
      this.fontSizes.label / 2

    this.canvas.drawText({
      text: label,
      x,
      y,
      font: `${this.fontSizes.label}px serif`,
      color: this.colors.label,
      align: 'center',
      baseline: 'alphabetic',
    })
  }

  getMaxWidthOfValues() {
    let maxLengthOfValues = 0
    let valueWithMaxLength = ''

    this.data.forEach((column) => {
      if (maxLengthOfValues < column.max.toString().length) {
        valueWithMaxLength = column.max
        maxLengthOfValues = column.max.toString().length
      }

      if (maxLengthOfValues < column.min.toString().length) {
        valueWithMaxLength = column.min
        maxLengthOfValues = column.min.toString().length
      }
    })

    return this.canvas.getTextWidth(
      valueWithMaxLength,
      `${this.fontSizes.label}px serif`
    )
  }
}

export { ColumnChart }
