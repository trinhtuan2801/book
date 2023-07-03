export const getTimeDiff = (old_date, new_date, type = 'millisecond') => {
  let date1 = typeof old_date === 'string' ? new Date(old_date) : old_date
  let date2 = typeof new_date === 'string' ? new Date(new_date) : new_date
  const diffTime = Math.abs(date2 - date1);
  switch (type) {
    case 'millisecond': return diffTime
    case 'second': return Math.floor(diffTime / 1000)
    case 'minute': return Math.floor(diffTime / 1000 / 60)
    case 'hour': return Math.floor(diffTime / 1000 / 60 / 60)
    case 'day': return Math.floor(diffTime / 1000 / 60 / 60 / 24)
    case 'month': return Math.floor(diffTime / 1000 / 60 / 60 / 24 / 30)
    case 'year': return Math.floor(diffTime / 1000 / 60 / 60 / 24 / 30 / 365)
  }
}