import React from 'react'
import Spinner from './components/Spinner'
import Error from './components/Error'
import moment from 'moment'
import { extractRate, date } from './utils'
import { fetchRates, fetchAll } from './requests'
import { useQuery } from 'react-query'
import { Box, Typography, Tooltip } from '@mui/material'
import { Table, TableCell, TableHead, TableRow } from '@mui/material'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function App() {
  const { isLoading: isLoadingFirst, error: errorFirst, data: dataFirst } = useQuery('ratesFirst', () => fetchRates(date(0)), { retry: 0 })
  const { isLoading, data: currencyForOtherDays } = useQuery('rates', fetchAll)

  if (isLoadingFirst) return <Spinner />
  if (errorFirst) return <Error errorFirst={errorFirst} />

  const { previous: second } = extractRate(dataFirst.Valute)

  const array = new Array(10).fill(0)

  return (
    <>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        Курсы валют ЦБ РФ на {moment().format('MMMM Do (dddd) YYYY')}
      </Typography>
      <Box sx={{ width: '80%', margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '25%', textAlign: 'center' }}>Буквенный код валюты</TableCell>
              <TableCell sx={{ width: '25%', textAlign: 'center' }}>Цифровой код валюты</TableCell>
              <TableCell sx={{ width: '25%', textAlign: 'center' }}>Курс</TableCell>
              <TableCell sx={{ width: '25%', textAlign: 'center' }}>%</TableCell>
            </TableRow>
          </TableHead>
        </Table>
        {Object.entries(dataFirst.Valute).map(([code, currency]) => {
          let change = ((currency.Value / currency.Previous - 1) * 100).toFixed(2)

          return (
            <Tooltip title={currency.Name} followCursor key={code}>
              <Accordion key={code}>
                <AccordionSummary sx={{ padding: '0' }}>
                  <Typography sx={{ width: '25%', textAlign: 'center' }}>{code}</Typography>
                  <Typography sx={{ width: '25%', textAlign: 'center' }}>{currency.NumCode}</Typography>
                  <Typography sx={{ width: '25%', textAlign: 'center' }}>{currency.Value}</Typography>
                  <Typography sx={{ width: '25%', display: 'flex', justifyContent: 'center', color: change >= 0 ? 'green' : 'red' }}>
                    {change >= 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    {change}%
                  </Typography>
                </AccordionSummary>

                {isLoading ? (
                  <Spinner />
                ) : (
                  ((currencyForOtherDays[1] = second),
                  array.map((_, index) => {
                    if (index === 0) return null
                    return (
                      <AccordionDetails key={index}>
                        <Typography sx={{ width: '50%', textAlign: 'center', display: 'inline-block' }}>
                          Курс на {date(index).format('DD MMMM (dddd) YYYY')}
                        </Typography>
                        <Typography sx={{ width: '50%', textAlign: 'center', display: 'inline-block' }}>
                          {currencyForOtherDays[index]?.[code] || 'Нет данных'}
                        </Typography>
                      </AccordionDetails>
                    )
                  }))
                )}
              </Accordion>
            </Tooltip>
          )
        })}
      </Box>
    </>
  )
}
