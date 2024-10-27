import React, { useState } from "react";
import { Calendar, Badge, Modal } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const CalendarComponent = () => {
  const { events } = useSelector((state) => state.events); // Adjust selector as needed
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventList, setEventList] = useState([]);

  // Helper function to format events by date, including multi-day events
  const formatEventsByDate = () => {
    const eventsByDate = {};

    events.forEach((event) => {
      const startDate = dayjs(event.startDate);
      const endDate = dayjs(event.endDate || event.startDate); // Defaults to startDate if no endDate

      for (
        let date = startDate;
        date.isBefore(endDate) || date.isSame(endDate);
        date = date.add(1, "day")
      ) {
        const dateKey = date.format("DD-MM-YYYY");
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push({
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          organizer: event.organizer,
          description: event.description,
        });
      }
    });

    return eventsByDate;
  };

  const formattedEvents = formatEventsByDate();

  // Cell render function to display events in the calendar cells
  const cellRender = (value) => {
    const dateString = value.format("DD-MM-YYYY");
    const eventList = formattedEvents[dateString];

    return (
      <div>
        {eventList
          ? eventList.map((event, index) => (
              <Badge
                key={index}
                count={event.title}
                style={{ backgroundColor: "#52c41a" }}
              />
            ))
          : null}
      </div>
    );
  };

  // Function to show events in a modal on date selection
  const onDateSelect = (date) => {
    const dateString = date.format("DD-MM-YYYY");
    const eventsForDate = formattedEvents[dateString] || [];

    setSelectedDate(dateString);
    setEventList(eventsForDate);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="calendar-container">
      <Calendar cellRender={cellRender} onSelect={onDateSelect} />

      <Modal
        title={`Events on ${selectedDate}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {eventList.length > 0 ? (
          <ul>
            {eventList.map((event, index) => (
              <div key={index} className="flex flex-col space-y-2 p-2 border-b">
                <li>
                  <strong>Title:</strong> {event.title}
                </li>
                <li>
                  <strong>Dates:</strong>{" "}
                  {`${dayjs(event.startDate).format("DD/MM/YYYY")} - ${
                    event.endDate
                      ? dayjs(event.endDate).format("DD/MM/YYYY")
                      : dayjs(event.startDate).format("DD/MM/YYYY")
                  }`}
                </li>
                <li>
                  <strong>Organizer:</strong> {event.organizer || "N/A"}
                </li>
                <li>
                  <strong>Description:</strong>{" "}
                  {event.description || "No description available"}
                </li>
              </div>
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
