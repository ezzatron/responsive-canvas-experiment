window.addEventListener('DOMContentLoaded', main, {once: true})

function update (state, elapsed) {
}

const RESIZE_TTL = 200
const throttledResizeCanvas = throttle(RESIZE_TTL, resizeCanvas)

function draw (canvas, ctx) {
  const {width, height} = document.documentElement.getBoundingClientRect()

  if (canvas.width !== width || canvas.height !== height) {
    throttledResizeCanvas(width, height, canvas)
  }

  ctx.fillStyle = 'skyblue'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function resizeCanvas (width, height, canvas) {
  const deltaWidth = canvas.width / width
  const deltaHeight = canvas.height / height

  canvas.width = width
  canvas.height = height

  canvas.animate(
    [
      {
        transformOrigin: 'center center',
        transform: `scale(${deltaWidth}, ${deltaHeight})`,
      },
      {
        transformOrigin: 'center center',
        transform: 'none',
      },
    ],
    {
      duration: RESIZE_TTL,
      easing: 'ease-in-out',
    },
  )
}

function createLoop (canvas, ctx) {
  const state = {}
  let previousTimestamp = -1

  return loop

  function loop (timestamp) {
    const elapsed = previousTimestamp > 0 ? timestamp - previousTimestamp : 0

    update(state, elapsed)
    draw(canvas, ctx)

    previousTimestamp = timestamp
    window.requestAnimationFrame(loop)
  }
}

function main () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const loop = createLoop(canvas, ctx)

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
