// src/RentComputerGPT2.jsx
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Select, InputLabel, FormControl, Grid } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import {AdapterDayjs} from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/he';

const computers = [
  { id: 1, name: 'Computer 1' },
  { id: 2, name: 'Computer 2' },
  { id: 3, name: 'Computer 3' },
  { id: 4, name: 'Computer 4' },
  { id: 5, name: 'Computer 5' },
];

const RentComputerGPT2 = () => {
  const [rentalType, setRentalType] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedComputer, setSelectedComputer] = useState('');
  const [isComputerAvailable, setIsComputerAvailable] = useState(false);

  useEffect(() => {
    // Check availability of the selected computer
    if (selectedComputer && startTime && endTime) {
      // Mock availability check
      const isAvailable = true; // Replace with actual availability logic
      setIsComputerAvailable(isAvailable);
    }
  }, [selectedComputer, startTime, endTime]);

  const handleSave = () => {
    if (isComputerAvailable && rentalType && startTime && endTime) {
      console.log({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        computerId: selectedComputer,
        userId: 123, // Replace with actual user ID
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Rental Type</InputLabel>
            <Select value={rentalType} onChange={(e) => setRentalType(e.target.value)}>
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            renderInput={(props) => <TextField fullWidth {...props} />}
          />
        </Grid>
        <Grid item xs={12}>
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            renderInput={(props) => <TextField fullWidth {...props} />}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Computer</InputLabel>
            <Select value={selectedComputer} onChange={(e) => setSelectedComputer(e.target.value)}>
              {computers.map((computer) => (
                <MenuItem
                  key={computer.id}
                  value={computer.id}
                  style={{ color: isComputerAvailable ? 'black' : 'red' }}
                >
                  {computer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isComputerAvailable || !rentalType || !startTime || !endTime}
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default RentComputerGPT2;
