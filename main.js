window.addEventListener('DOMContentLoaded', main, {once: true})

function update (state, elapsed) {
}

function draw (canvas, ctx) {
  const {width, height} = canvas

  ctx.fillStyle = 'paleturquoise'
  ctx.fillRect(0, 0, width, height)

  const minDimension = width > height ? height : width
  const padding = minDimension / 10
  const doublePadding = padding * 2
  const quadPadding = padding * 4

  ctx.fillStyle = 'honeydew'
  ctx.fillRect(padding, padding, width - doublePadding, height - doublePadding)

  ctx.fillStyle = 'mistyrose'
  ctx.fillRect(doublePadding, doublePadding, width - quadPadding, height - quadPadding)
}

function createResizeMonitor (viewport, canvas) {
  let animation, timeoutId
  let nextWidth = canvas.width
  let nextHeight = canvas.height

  const animateResize = debounce(400, (width, height, scaleX, scaleY) => {
    if (animation) return

    canvas.width = width
    canvas.height = height

    animation = canvas.animate(
      [
        {transform: `scale(${scaleX}, ${scaleY})`},
        {transform: 'none'},
      ],
      {
        duration: 200,
        easing: 'ease-in-out',
      },
    )
    animation.addEventListener('finish', () => { animation = null }, {once: true})
  })

  return function monitorResize () {
    const {clientWidth: width, clientHeight: height} = viewport

    if (canvas.width === width && canvas.height === height) return

    const deltaWidth = canvas.width / width
    const deltaHeight = canvas.height / height
    const isWidthIncreasing = deltaWidth < 1
    const isHeightIncreasing = deltaHeight < 1
    const needsAnimation = isWidthIncreasing || isHeightIncreasing

    if (!isWidthIncreasing) canvas.width = width
    if (!isHeightIncreasing) canvas.height = height

    if (!needsAnimation) return
    if (nextWidth === width && nextHeight === height) return

    nextWidth = width
    nextHeight = height
    const scaleX = deltaWidth > 1 ? 1 : deltaWidth
    const scaleY = deltaHeight > 1 ? 1 : deltaHeight

    animateResize(width, height, scaleX, scaleY)
  }
}

function createLoop (viewport, canvas, ctx) {
  const state = {}
  const monitorResize = createResizeMonitor(viewport, canvas)
  let previousTimestamp = -1

  return loop

  function loop (timestamp) {
    const elapsed = previousTimestamp > 0 ? timestamp - previousTimestamp : 0

    monitorResize()
    update(state, elapsed)
    draw(canvas, ctx)

    previousTimestamp = timestamp
    window.requestAnimationFrame(loop)
  }
}

function main () {
  const viewport = document.documentElement
  const {clientWidth: width, clientHeight: height} = viewport

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.display = 'block'
  canvas.style.willChange = 'transform'

  const ctx = canvas.getContext('2d')
  const loop = createLoop(viewport, canvas, ctx)

  document.body.appendChild(canvas)
  window.requestAnimationFrame(loop)
}

function debounce (delay, fn) {
  let timeoutId

  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}
