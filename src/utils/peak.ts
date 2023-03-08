const PEAK_COUNT = 6000

export default (buffer: AudioBuffer): HTMLOrSVGElement => {
  const svg = document.createElement('svg')
  svg.setAttribute('viewBox', `0 -1 ${PEAK_COUNT} 2`)
  svg.setAttribute('preserveAspectRatio', 'none')

  const g = document.createElement('g')
  svg.append(g)

  const path = document.createElement('path')
  path.setAttribute('d', draw(getPeaks(buffer)))
  g.append(path)

  return svg
}

const draw = (peaks: number[]): string => {
  const size = peaks.length

  let d = ''
  for (let i = 0; i < size; i++) {
    if (i % 2 === 0) {
      d += ` M${~~(i / 2)}, ${peaks.shift()}`
    } else {
      d += ` L${~~(i / 2)}, ${peaks.shift()}`
    }
  }

  return d
}

const getPeaks = (buffer: AudioBuffer): number[] => {
  const size = buffer.length / PEAK_COUNT
  const step = ~~(size / 10) || 1
  const data = buffer.getChannelData(0)

  const peaks: number[] = []

  for (let i = 0; i < PEAK_COUNT; i++) {
    const start = ~~(i * size)
    const end = ~~(start + size)
    let min = data[0]
    let max = data[0]

    for (let j = start; j < end; j += step) {
      const value = data[j]
      value > max && (max = value)
      value < min && (min = value)
    }

    peaks[2 * i] = max
    peaks[2 * i + 1] = min
  }

  return peaks
}
