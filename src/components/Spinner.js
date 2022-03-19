import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export default function Spinner() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  )
}
