import React, { useState } from 'react';
import { Calendar, Badge, Modal } from 'antd';
import dayjs from 'dayjs';

const events = {
  '2024-10-01': [{ title: 'Parent-Teacher Meeting' }],
  '2024-10-15': [{ title: 'School Sports Day' }],
  '2024-10-20': [{ title: 'Mid-Term Exams' }],
  // Add more events as needed
};

const cellRender = (value) => {
  const dateString = value.format('YYYY-MM-DD');
  const eventList = events[dateString];

  return (
    <div>
      {eventList ? eventList.map((event, index) => (
        <Badge key={index} count={event.title} style={{ backgroundColor: '#52c41a' }} />
      )) : null}
    </div>
  );
};

const CalendarComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [eventList, setEventList] = useState([]);

  const onDateSelect = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    const eventsForDate = events[dateString] || [];
    
    setSelectedDate(dateString);
    setEventList(eventsForDate);
    setIsModalVisible(true); // Show the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="calendar-container">
      <Calendar 
        cellRender={cellRender}
        onSelect={onDateSelect}
      />

      <Modal
        title={`Events on ${selectedDate}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {eventList.length > 0 ? (
          <ul>
            {eventList.map((event, index) => (
              <li key={index}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p>No events for this date.</p>
        )}
      </Modal>
    </div>
  );
};

export default CalendarComponent;
