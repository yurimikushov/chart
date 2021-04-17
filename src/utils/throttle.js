function throttle(cb, ms) {
  let lastCall = null

  return function (...args) {
    if (lastCall && performance.now() - lastCall < ms) {
      return
    }

    cb.apply(this, args)
    lastCall = performance.now()
  }
}

export { throttle }
