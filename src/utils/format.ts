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
