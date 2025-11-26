import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function CalendarHeader({ date, onPrev, onNext }) {
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      <Box>
        <Button onClick={onPrev} startIcon={<ArrowBackIosNewIcon />}>Prev</Button>
        <Button onClick={onNext} endIcon={<ArrowForwardIosIcon />}>Next</Button>
      </Box>
      <Typography variant="h6">{monthName}</Typography>
      <Box />
    </Box>
  );
}
