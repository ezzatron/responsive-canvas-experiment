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
  return function monitorResize (elapsed) {
    canvas.width = viewport.scrollWidth
    canvas.height = viewport.scrollHeight
  }
}

function createLoop (viewport, canvas, ctx) {
  const state = {}
  const monitorResize = createResizeMonitor(viewport, canvas)
  let previousTimestamp = -1

  return loop

  function loop (timestamp) {
    const elapsed = previousTimestamp > 0 ? timestamp - previousTimestamp : 0

    monitorResize(elapsed)
    update(state, elapsed)
    draw(canvas, ctx)

    previousTimestamp = timestamp
    window.requestAnimationFrame(loop)
  }
}

function main () {
  const viewport = document.documentElement
  const {scrollWidth: width, scrollHeight: height} = viewport

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
