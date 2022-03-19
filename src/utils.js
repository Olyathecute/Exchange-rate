import moment from 'moment'

export const extractRate = (valute) => {
  const current = {}
  const previous = {}
  for (let item in valute) {
    current[item] = valute[item].Value
    previous[item] = valute[item].Previous
  }
  return { current, previous }
}

export const date = (daysBefore) => moment().subtract(daysBefore, 'days')
