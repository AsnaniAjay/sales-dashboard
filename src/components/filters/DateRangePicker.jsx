// src/components/filters/DateRangePicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, XIcon } from '@heroicons/react/solid';

const DateRangePicker = ({ onChange, initialStartDate, initialEndDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');
  const [activeInput, setActiveInput] = useState('start');
  const [hoverDate, setHoverDate] = useState(null);
  const wrapperRef = useRef(null);

  // Handle outside clicks to close the calendar
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  // When dates change, notify parent component
  useEffect(() => {
    if (startDate && endDate) {
      onChange({ startDate, endDate });
    }
  }, [startDate, endDate, onChange]);

  // Get current date and last 30 days for initial range
  useEffect(() => {
    if (!initialStartDate && !initialEndDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      setEndDate(formatDate(today));
      setStartDate(formatDate(thirtyDaysAgo));
    }
  }, [initialStartDate, initialEndDate]);

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const dateStr = day.date;
    if (activeInput === 'start') {
      setStartDate(dateStr);
      setActiveInput('end');
      if (new Date(dateStr) > new Date(endDate)) {
        setEndDate('');
      }
    } else {
      if (new Date(dateStr) >= new Date(startDate)) {
        setEndDate(dateStr);
        setIsOpen(false);
      } else {
        setStartDate(dateStr);
        setActiveInput('end');
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = activeInput === 'start' ? 
      (startDate ? new Date(startDate) : today) : 
      (endDate ? new Date(endDate) : today);
    
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ empty: true });
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateStr = formatDate(date);
      
      days.push({
        day: i,
        date: dateStr,
        isToday: dateStr === formatDate(today),
        isInRange: startDate && endDate && 
          new Date(dateStr) >= new Date(startDate) && 
          new Date(dateStr) <= new Date(endDate),
        isStart: dateStr === startDate,
        isEnd: dateStr === endDate,
        isHovered: hoverDate && 
          startDate && 
          !endDate && 
          new Date(dateStr) >= new Date(startDate) && 
          new Date(dateStr) <= new Date(hoverDate)
      });
    }
    
    return days;
  };

  // Get current month and year for display
  const getCurrentMonthYear = () => {
    const currentMonth = activeInput === 'start' ? 
      (startDate ? new Date(startDate) : new Date()) : 
      (endDate ? new Date(endDate) : new Date());
    
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Change month
  const changeMonth = (increment) => {
    const currentMonth = activeInput === 'start' ? 
      (startDate ? new Date(startDate) : new Date()) : 
      (endDate ? new Date(endDate) : new Date());
    
    currentMonth.setMonth(currentMonth.getMonth() + increment);
    
    if (activeInput === 'start') {
      setStartDate(formatDate(currentMonth));
    } else {
      setEndDate(formatDate(currentMonth));
    }
  };

  // Handle mouse over for range preview
  const handleDayHover = (day) => {
    if (startDate && !endDate && day.date) {
      setHoverDate(day.date);
    }
  };

  // Clear the date range
  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
    setActiveInput('start');
    onChange({ startDate: '', endDate: '' });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <button
          type="button"
          className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
            <span>
              {startDate && endDate 
                ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
                : 'Select date range'}
            </span>
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-auto z-10 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{getCurrentMonthYear()}</h3>
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => changeMonth(-1)}
              >
                <span className="sr-only">Previous month</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => changeMonth(1)}
              >
                <span className="sr-only">Next month</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`p-2 text-center text-sm ${
                  day.empty 
                    ? 'invisible' 
                    : 'cursor-pointer'
                } ${
                  day.isToday 
                    ? 'font-bold' 
                    : ''
                } ${
                  day.isStart || day.isEnd
                    ? 'bg-indigo-600 text-white rounded-md' 
                    : day.isInRange || day.isHovered
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => !day.empty && handleDateClick(day)}
                onMouseOver={() => handleDayHover(day)}
              >
                {!day.empty && day.day}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
              onClick={handleClearDates}
            >
              <XIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  activeInput === 'start'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveInput('start')}
              >
                Start Date
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  activeInput === 'end'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveInput('end')}
              >
                End Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;