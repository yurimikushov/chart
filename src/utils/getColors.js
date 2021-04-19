import { CHART_DEFAULT_COLORS } from '../constants'

function getColors(colors) {
  const initialColors = { ...CHART_DEFAULT_COLORS }

  if (!colors) {
    return initialColors
  }

  for (let key in colors) {
    initialColors[key] = colors[key]
  }

  return initialColors
}

export { getColors }
