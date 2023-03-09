export const today = (): string => {
  const now = new Date()
  const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map(i => String(i).padStart(2, '0'))
    .join('-')
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(i => String(i).padStart(2, '0'))
    .join(':')
  return `${date} ${time}`
}

export const timeFormatter = (time: number) => {
  if (!time) return ''

  const seconds = ~~(time % 60)
  const minutes = ~~(time / 60) % 60
  const formatted = [String(minutes).padStart(2, '0'), String(seconds).padStart(2, '0')]

  const hours = ~~(time / 3600)
  if (hours) formatted.unshift(String(hours))

  return formatted.join(':')
}
