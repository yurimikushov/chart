function throttle(cb, ms) {
  let lastCall = null

  return function (...args) {
    if (lastCall && Date.now() - lastCall < ms) {
      return
    }

    cb.apply(this, args)
    lastCall = Date.now()
  }
}

export { throttle }
