function createCanvas({ height, width }) {
  const canvas = document.createElement('canvas')

  canvas.height = height
  canvas.width = width

  return canvas
}

export { createCanvas }
