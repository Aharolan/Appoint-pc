import React, { useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import './RentComputer.css';

const computers = [
    { id: 1, name: 'Computer 1', availability: [{ start: '2024-07-22T08:00', end: '2024-07-22T10:00' }] },
    { id: 2, name: 'Computer 2', availability: [] },
    { id: 3, name: 'Computer 3', availability: [] },
    { id: 4, name: 'Computer 4', availability: [] },
    { id: 5, name: 'Computer 5', availability: [] },
  ];

const RentComputerGPT = () => {
    const [rentalType, setRentalType] = useState('hourly');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedComputer, setSelectedComputer] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
  
    const handleRentalTypeChange = (e) => setRentalType(e.target.value);
    const handleStartTimeChange = (e) => setStartTime(e.target.value);
    const handleEndTimeChange = (e) => setEndTime(e.target.value);
    const handleComputerChange = (e) => setSelectedComputer(e.target.value);
    const handleDateChange = (date) => setSelectedDate(date);
  
    const handleSave = () => {
      if (startTime && endTime && selectedComputer) {
        const computer = computers.find(c => c.id === parseInt(selectedComputer));
        if (computer && !isTimeConflicting(computer.availability, startTime, endTime)) {
          console.log({
            startTime,
            endTime,
            computerId: selectedComputer,
            userId: 'user-id-example' // Replace with actual user ID
          });
        }
      }
    };
  
    const isTimeConflicting = (availability, startTime, endTime) => {
      const start = moment(startTime);
      const end = moment(endTime);
      return availability.some(period => {
        const periodStart = moment(period.start);
        const periodEnd = moment(period.end);
        return start.isBefore(periodEnd) && end.isAfter(periodStart);
      });
    };
  
    const isFormValid = () => {
      return startTime && endTime && selectedComputer && !isTimeConflicting(computers.find(c => c.id === parseInt(selectedComputer)).availability, startTime, endTime);
    };
  
    return (
      <div className="rent-computer">
        <div className="form-group">
          <label>Rental Type:</label>
          <select value={rentalType} onChange={handleRentalTypeChange}>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
  
        <div className="form-group">
          <label>Start Time:</label>
          <input type="datetime-local" value={startTime} onChange={handleStartTimeChange} />
        </div>
  
        <div className="form-group">
          <label>End Time:</label>
          <input type="datetime-local" value={endTime} onChange={handleEndTimeChange} />
        </div>
  
        <div className="form-group">
          <label>Computer:</label>
          <select value={selectedComputer} onChange={handleComputerChange}>
            <option value="">Select a computer</option>
            {computers.map(computer => (
              <option key={computer.id} value={computer.id}>
                {computer.name}
              </option>
            ))}
          </select>
        </div>
  
        <div className="form-group">
          <label>Hebrew Calendar:</label>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileClassName={({ date }) => {
              const computer = computers.find(c => c.id === parseInt(selectedComputer));
              const formattedDate = moment(date).format('YYYY-MM-DD');
              return computer && computer.availability.some(avail => formattedDate === moment(avail.start).format('YYYY-MM-DD')) ? 'booked' : '';
            }}
          />
        </div>
  
        <button
          className="save-button"
          disabled={!isFormValid()}
          onClick={handleSave}
          style={{ backgroundColor: isFormValid() ? 'grey' : 'lightgrey' }}
        >
          Save
        </button>
      </div>
    );
};

export default RentComputerGPT;
