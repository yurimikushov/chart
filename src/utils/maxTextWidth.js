import { createCanvas } from './createCanvas'

function maxTextWidth(fontSize, textArr) {
  const canvas = createCanvas({ height: 50, width: 100 })
  const ctx = canvas.getContext('2d')
  ctx.font = `${fontSize}px serif`
  return ctx.measureText(Math.max(...textArr)).width
}

export { maxTextWidth }
