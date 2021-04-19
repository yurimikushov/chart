import { CHART_DEFAULT_SIZE } from '../constants'

function getSize(size) {
  const initialSize = { ...CHART_DEFAULT_SIZE }

  if (!size) {
    return initialSize
  }

  for (let key in size) {
    initialSize[key] = size[key]
  }

  return initialSize
}

export { getSize }
