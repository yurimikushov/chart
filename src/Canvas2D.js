class Canvas2D {
  constructor(container, size) {
    this.$container = container
    this.size = size
    this.canvas = this.create()
    this.ctx = this.canvas.getContext('2d')
  }

  create() {
    const canvas = document.createElement('canvas')

    canvas.height = this.size.height
    canvas.width = this.size.width

    return canvas
  }

  mount() {
    this.$container.append(this.canvas)
  }

  unmount() {
    this.canvas.remove()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height)
  }

  setBackgroundColor(color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.size.width, this.size.height)
  }

  drawText({
    text,
    x,
    y,
    font,
    color,
    align = 'start',
    baseline = 'alphabetic',
  }) {
    this.ctx.fillStyle = color
    this.ctx.font = font
    this.ctx.textAlign = align
    this.ctx.textBaseline = baseline
    this.ctx.fillText(text, x, y)
  }

  drawYLine({ x, y, height, color }) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x, height)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
  }

  drawXLine({ x, y, width, color }) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(width, y)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
  }

  drawRect({ x, y, width, height, color }) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, width, height)
  }

  getTextWidth(text, font) {
    this.ctx.save()
    this.ctx.font = font

    const measure = this.ctx.measureText(text)

    this.ctx.restore()

    return measure.width
  }
}

export default Canvas2D
