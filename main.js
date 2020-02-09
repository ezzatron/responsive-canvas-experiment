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

const RESIZE_TTL = 200
const throttledResizeCanvas = throttle(RESIZE_TTL, resizeCanvas)

function monitorViewport (viewport, canvas) {
  const {clientWidth: width, clientHeight: height} = viewport

  if (canvas.width !== width || canvas.height !== height) throttledResizeCanvas(width, height, canvas)
}

function resizeCanvas (width, height, canvas) {
  const deltaWidth = canvas.width / width
  const deltaHeight = canvas.height / height

  canvas.width = width
  canvas.height = height

  canvas.animate(
    [
      {
        transform: `scale(${deltaWidth}, ${deltaHeight})`,
      },
      {
        transform: 'none',
      },
    ],
    {
      duration: RESIZE_TTL,
      easing: 'ease-in-out',
    },
  )
}

function createLoop (viewport, canvas, ctx) {
  const state = {}
  let previousTimestamp = -1

  return loop

  function loop (timestamp) {
    const elapsed = previousTimestamp > 0 ? timestamp - previousTimestamp : 0

    monitorViewport(viewport, canvas)
    update(state, elapsed)
    draw(canvas, ctx)

    previousTimestamp = timestamp
    window.requestAnimationFrame(loop)
  }
}

function main () {
  const canvas = document.createElement('canvas')
  canvas.style.display = 'block'
  canvas.style.willChange = 'transform'

  const ctx = canvas.getContext('2d')
  const loop = createLoop(document.documentElement, canvas, ctx)

  document.body.appendChild(canvas)
  window.requestAnimationFrame(loop)
}

function throttle (delay, fn) {
  let trailId, waitId

  return (...args) => {
    if (trailId) clearTimeout(trailId)
    trailId = setTimeout(() => { fn(...args) }, delay)

    if (waitId) return

    fn(...args)
    waitId = setTimeout(() => { waitId = null }, delay)
  }
}
