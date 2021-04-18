function convertToMinMaxFormat(data) {
  if (data.length === 0) {
    return data
  }

  if ('min' in data[0] && 'max' in data[0]) {
    return data
  }

  return data.map(({ label, value, color }) => ({
    label,
    min: value > 0 ? 0 : value,
    max: value <= 0 ? 0 : value,
    color,
  }))
}

export { convertToMinMaxFormat }
