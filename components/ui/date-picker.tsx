// components/ui/date-picker.tsx
import React from 'react';
import DatePickerComponent from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  return (
    <DatePickerComponent
      selected={selectedDate}
      onChange={onDateChange}
      className="input"
      dateFormat="yyyy/MM/dd"
      placeholderText="Select a date"
    />
  );
};

export { DatePicker };
