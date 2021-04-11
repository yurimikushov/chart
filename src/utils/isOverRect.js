function isOverRect(x, y, rectX, rectY, rectWidth, rectHeigth) {
  const x1 = rectX
  const x2 = rectX + rectWidth
  const y1 = rectY
  const y2 = rectY + rectHeigth

  const isOverX = x1 <= x && x <= x2
  const isOverY = y1 <= y && y <= y2

  return isOverX && isOverY
}

export { isOverRect }
