export default (element: HTMLElement | null) => {
  if (!element) return

  const piecesX = 9
  const piecesY = 4

  const width = pxToEm(element.offsetWidth)
  const height = pxToEm(element.offsetHeight)
  const centerX = width / 2
  const centerY = height / 2
  const pieceWidth = width / piecesX
  const pieceHeight = height / piecesY

  if (!element.classList.contains('exploding')) {
    element.classList.add('exploding')

    createParticles('fire', 25, 1500)
    createParticles('debris', piecesX * piecesY, 1500)
  }

  function createParticles(kind: 'fire' | 'debris', count: number, duration: number) {
    if (!element) return

    for (let c = 0; c < count; ++c) {
      const r = randomFloat(0.25, 0.5)
      const diam = r * 2
      const xBound = centerX - r
      const yBound = centerY - r
      const easing = 'cubic-bezier(0.15,0.5,0.5,0.85)'

      if (kind === 'fire') {
        const x = centerX + randomFloat(-xBound, xBound)
        const y = centerY + randomFloat(-yBound, yBound)
        const a = calcAngle(centerX, centerY, x, y)
        const dist = randomFloat(1, 5)

        new FireParticle(element, x, y, diam, diam, a, dist, duration, easing)
      } else if (kind === 'debris') {
        const x = pieceWidth / 2 + pieceWidth * (c % piecesX)
        const y = pieceHeight / 2 + pieceHeight * Math.floor(c / piecesX)
        const a = calcAngle(centerX, centerY, x, y)
        const dist = randomFloat(4, 7)

        new DebrisParticle(element, x, y, pieceWidth, pieceHeight, a, dist, duration, easing)
      }
    }
  }
}

class Particle {
  div: HTMLDivElement

  s: { x: number; y: number }
  d: { x: number; y: number }

  constructor(
    parent: HTMLElement,
    x: number,
    y: number,
    w: number,
    h: number,
    angle: number,
    distance = 1,
    className2 = ''
  ) {
    const width = `${w}em`
    const height = `${h}em`
    const adjustedAngle = angle + Math.PI / 2

    this.div = document.createElement('div')
    this.div.className = 'particle'

    if (className2) this.div.classList.add(className2)

    this.div.style.width = width
    this.div.style.height = height

    parent.appendChild(this.div)

    this.s = {
      x: x - w / 2,
      y: y - h / 2
    }
    this.d = {
      x: this.s.x + Math.sin(adjustedAngle) * distance,
      y: this.s.y - Math.cos(adjustedAngle) * distance
    }
  }

  runSequence(
    el: HTMLElement,
    keyframesArray: Keyframe[],
    duration = 1e3,
    easing = 'linear',
    delay = 0
  ) {
    const animation = el.animate(keyframesArray, {
      duration: duration,
      easing: easing,
      delay: delay
    })
    animation.onfinish = () => {
      const parentCL = el.parentElement?.classList

      el.remove()

      if (!document.querySelector('.particle')) {
        parentCL?.forEach(cb => {
          parentCL.remove(cb)
        })
      }
    }
  }
}

class DebrisParticle extends Particle {
  constructor(
    parent: HTMLElement,
    x: number,
    y: number,
    w: number,
    h: number,
    angle: number,
    distance: number,
    duration: number,
    easing: string
  ) {
    super(parent, x, y, w, h, angle, distance, 'particle--debris')

    const maxAngle = 1080
    const rotX = randomInt(0, maxAngle)
    const rotY = randomInt(0, maxAngle)
    const rotZ = randomInt(0, maxAngle)

    this.runSequence(
      this.div,
      [
        {
          opacity: 1,
          transform: `translate(${this.s.x}em,${this.s.y}em) rotateX(0) rotateY(0) rotateZ(0)`
        },
        {
          opacity: 1
        },
        {
          opacity: 1
        },
        {
          opacity: 1
        },
        {
          opacity: 0,
          transform: `translate(${this.d.x}em,${this.d.y}em) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`
        }
      ],
      randomInt(duration / 2, duration),
      easing
    )
  }
}

class FireParticle extends Particle {
  constructor(
    parent: HTMLElement,
    x: number,
    y: number,
    w: number,
    h: number,
    angle: number,
    distance: number,
    duration: number,
    easing: string
  ) {
    super(parent, x, y, w, h, angle, distance, 'particle--fire')

    const sx = this.s.x
    const sy = this.s.y
    const dx = this.d.x
    const dy = this.d.y

    this.runSequence(
      this.div,
      [
        {
          background: 'hsl(60,100%,100%)',
          transform: `translate(${sx}em,${sy}em) scale(1)`
        },
        {
          background: 'hsl(60,100%,80%)',
          transform: `translate(${sx + (dx - sx) * 0.25}em,${sy + (dy - sy) * 0.25}em) scale(4)`
        },
        {
          background: 'hsl(40,100%,60%)',
          transform: `translate(${sx + (dx - sx) * 0.5}em,${sy + (dy - sy) * 0.5}em) scale(7)`
        },
        {
          background: 'hsl(20,100%,40%)'
        },
        {
          background: 'hsl(0,0%,20%)',
          transform: `translate(${dx}em,${dy}em) scale(0)`
        }
      ],
      randomInt(duration / 2, duration),
      easing
    )
  }
}

function calcAngle(x1: number, y1: number, x2: number, y2: number) {
  const opposite = y2 - y1
  const adjacent = x2 - x1
  let angle = Math.atan(opposite / adjacent)

  if (adjacent < 0) angle += Math.PI

  if (isNaN(angle)) angle = 0

  return angle
}

function propertyUnitsStripped(el: Element | null, property: string, unit: string) {
  if (!el) return 0

  const cs = window.getComputedStyle(el)
  const valueRaw = cs.getPropertyValue(property)
  return ~~valueRaw.substring(0, valueRaw.indexOf(unit))
}

function pxToEm(px: number) {
  const el = document.querySelector(':root')
  return px / propertyUnitsStripped(el, 'font-size', 'px')
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min
}
