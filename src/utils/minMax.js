function minMax(data) {
  const minValues = []
  const maxValues = []

  for (let column of data) {
    minValues.push(column.min)
    maxValues.push(column.max)
  }

  const min = Math.min(...minValues)
  const max = Math.max(...maxValues)

  return [min, max]
}

export { minMax }
