export const dateFormat = (now = new Date(), delimiter = ' '): string => {
  return (
    [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      .map(i => String(i).padStart(2, '0'))
      .join('-') +
    delimiter +
    [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(i => String(i).padStart(2, '0'))
      .join(':')
  )
}

export const timeFormat = (time: number): string => {
  return !time
    ? ''
    : [
        String(~~(time / 3600)),
        ...[~~(time / 60) % 60, ~~(time % 60)].map(i => String(i).padStart(2, '0'))
      ].join(':')
}
