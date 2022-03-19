import { extractRate, date } from './utils'

export const fetchRates = (momentDate) =>
  fetch(`https://www.cbr-xml-daily.ru/archive/${momentDate.format('Y/MM/DD')}/daily_json.js`).then((response) => response.json())

export const fetchAll = () =>
  new Promise(async (resolve) => {
    const fetchInitial = () => Promise.allSettled([2, 4, 6, 8].map((d) => fetchRates(date(d))))

    const data = await fetchInitial()

    const currencyForOtherDays = []
    const failedDate = new Set()

    data.forEach((element, index) => {
      const daysSubtracted = (index + 1) * 2

      if (element.status === 'rejected') {
        failedDate.add(daysSubtracted + 1)
        failedDate.add(daysSubtracted - 1)
      } else {
        const { current, previous } = extractRate(element.value.Valute)
        currencyForOtherDays[daysSubtracted] = current
        currencyForOtherDays[daysSubtracted + 1] = previous
      }
    })

    await Promise.all(
      Array.from(failedDate).map(async (item) => {
        try {
          const newFetch = await fetchRates(date(item))
          const { current, previous } = extractRate(newFetch.Valute)
          currencyForOtherDays[item] = current
          currencyForOtherDays[item + 1] = previous
        } catch (error) {}
      })
    )

    resolve(currencyForOtherDays)
  })
