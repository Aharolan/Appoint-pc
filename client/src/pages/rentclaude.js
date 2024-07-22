import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Button, Dropdown, Space, message } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/he';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('he');
const localizer = momentLocalizer(moment);

const { Option } = Select;
const { RangePicker } = DatePicker;

const RentalComputer = () => {
  const [rentalType, setRentalType] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [computers] = useState(['Computer 1', 'Computer 2', 'Computer 3', 'Computer 4', 'Computer 5']);
  const [events, setEvents] = useState([]);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Mock function to fetch existing rentals
    const fetchExistingRentals = () => {
      const mockRentals = [
        {
          title: 'Rented',
          start: new Date(2024, 7, 22, 10, 0),
          end: new Date(2024, 7, 22, 12, 0),
          resourceId: 'Computer 1',
        },
        {
          title: 'Rented',
          start: new Date(2023, 6, 21, 14, 0),
          end: new Date(2023, 6, 21, 16, 0),
          resourceId: 'Computer 2',
        },
        // Add more mock rentals as needed
      ];
      setEvents(mockRentals);
    };

    fetchExistingRentals();
  }, []);

  const handleRentalTypeChange = (value) => {
    setRentalType(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleComputerSelect = (computer) => {
    setSelectedComputer(computer);
  };

  const isTimeSlotAvailable = () => {
    if (!dateRange[0] || !dateRange[1] || !selectedComputer) return true;

    const start = dateRange[0].toDate();
    const end = dateRange[1].toDate();

    return !events.some(event => 
      event.resourceId === selectedComputer &&
      ((start >= event.start && start < event.end) ||
       (end > event.start && end <= event.end) ||
       (start <= event.start && end >= event.end))
    );
  };

  const computePrice = () => {
    if (!rentalType || !dateRange[0] || !dateRange[1]) return 0;

    const hours = moment(dateRange[1]).diff(moment(dateRange[0]), 'hours');
    let rate;

    switch(rentalType) {
      case 'hourly':
        rate = 8; // $10 per hour
        break;
      case 'daily':
        rate = 440; // $100 per day
        break;
      case 'weekly':
        rate = 160; // $500 per week
        break;
      case 'monthly':
        rate = 450; // $1500 per month
        break;
      default:
        rate = 0;
    }

    return (hours / 24) * rate;
  };

  const handleSave = () => {
    if (rentalType && dateRange.length === 2 && selectedComputer) {
      if (isTimeSlotAvailable()) {
        const rentalInfo = {
          rentalType,
          startTime: dateRange[0].format(),
          endTime: dateRange[1].format(),
          computerId: selectedComputer,
          price: computePrice(),
        };
        console.log('Saving rental:', rentalInfo);
        message.success('Rental saved successfully!');
      } else {
        message.error('Selected time slot is not available');
      }
    }
  };

  const isFormValid = rentalType && dateRange.length === 2 && selectedComputer;

  const items = computers.map((computer) => ({
    key: computer,
    label: computer,
  }));

  useEffect(() => {
    if (isFormValid) {
      const newPrice = computePrice();
      setPrice(newPrice);
    } else {
      setPrice(0);
    }
  }, [rentalType, dateRange, selectedComputer]);

  return (
    <div className="rental-computer">
      <h1>Computer Rental</h1>
      
      <Space direction="vertical" size="large" style={{ display: 'flex', marginBottom: 20 }}>
        <Select
          style={{ width: 200 }}
          placeholder="Select rental type"
          onChange={handleRentalTypeChange}
        >
          <Option value="hourly">Hourly</Option>
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
        </Select>

        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          onChange={handleDateRangeChange}
        />

        <Dropdown menu={{ items, onClick: ({ key }) => handleComputerSelect(key) }}>
          <Button>
            {selectedComputer || 'Select a computer'}
          </Button>
        </Dropdown>
      </Space>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, marginBottom: 20 }}
        views={['week']}
        defaultView='week'
        resources={computers.map(computer => ({ id: computer, title: computer }))}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
      />

      {price > 0 && <p>Estimated Price: ${price.toFixed(2)}</p>}

      <Button
        type="primary"
        onClick={handleSave}
        disabled={!isFormValid || !isTimeSlotAvailable()}
      >
        Save Rental
      </Button>
    </div>
  );
};

export default RentalComputer;