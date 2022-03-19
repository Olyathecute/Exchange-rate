import React from 'react'
import { Box, Typography } from '@mui/material'

export default function Spinner({ errorFirst }) {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h5">Ошибка: {errorFirst.message}</Typography>
    </Box>
  )
}
