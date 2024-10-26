import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  DatePicker,
  Form,
  Input,
  Button,
  Card,
  Modal,
  List,
  Tabs,
  Select,
  Checkbox,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, fetchEvents } from "../../../../Redux/slices/eventSlice.js";

const EventManagement = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startTime: dayjs().hour(0).minute(0).second(0), // Set default start time to 00:00:00
      endTime: dayjs().hour(0).minute(0).second(0), // Set default end time to 00:00:00
    },
  });

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // State variable to track if the event is recurring and has a frequency
  const [isEventDailyRecurring, setIsEventDailyRecurring] = useState(false);

  const { events } = useSelector((state) => state.events);

  const [upcomingEvents, setUpcomingEvents] = useState();

  const [activeEvents, setActiveEvents] = useState();

  const [pastEvents, setPastEvents] = useState();

  const onSubmit = (data) => {
    // Format the start and end dates before pushing them into newEvents
    const startDate = data.startDate;
    let endDate = data.endDate ? data.endDate : null;

    if (data.isRecurring) {
      // console.log("recurring true", data);
      createRecurringEvents(data);
    } else {
      // console.log("Non recurring data", data);

      const newEvent = {
        id: events.length + 1,
        title: data.title,
        startDate: startDate?.format("YYYY-MM-DD"),
        endDate: endDate?.format("YYYY-MM-DD"),
        description: data.description,
        organizer: data.organizer,
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        isRecurring: false,
      };

      dispatch(addEvent(newEvent));
    }
  };

  useEffect(() => {
    if (events) {
      const upcomingEvents = events.filter((event) =>
        dayjs().isBefore(event.startDate)
      );

      const pastEvents = events.filter((event) =>
        dayjs().isAfter(event.endDate)
      );

      const activeEvents = events.filter(
        (event) =>
          dayjs().isAfter(event.startDate) && dayjs().isBefore(event.endDate)
      );

      setUpcomingEvents(upcomingEvents);
      setActiveEvents(activeEvents);
      setPastEvents(pastEvents);
    }
    dispatch(fetchEvents());
  }, [events]);

  const createRecurringEvents = (data) => {
    const occurrences = [];
    console.log("recurring data", data);
    // Format the start and end dates before pushing them into newEvents
    const startDate = data.startDate;
    let endDate = data.endDate ? data.endDate : null;

    const frequency = data.recurringType;

    if (frequency === "daily") {
      // Important dont delete. Edge case resolved
      if (endDate) {
        data.endDate = undefined;
        endDate = undefined;
      }
    }

    const count = data.recurringCount;
    console.log("Data", data);

    console.log("startDate", startDate);

    if (frequency === "daily" && count > 31) {
      alert("Daily events cannot exceed 30 occurrences.");
      return [];
    }
    if (frequency === "weekly" && count > 5) {
      alert("Weekly events cannot exceed 5 occurrences.");
      return [];
    }
    if (frequency === "monthly" && count > 12) {
      alert("Monthly events cannot exceed 12 occurrences.");
      return [];
    }

    for (let i = 0; i < count; i++) {
      let eventStartDate;
      let eventEndDate;
      if (frequency === "daily") {
        eventStartDate = startDate.add(i, "day");
      } else if (frequency === "weekly") {
        eventStartDate = startDate.add(i, "week");
        eventEndDate = endDate.add(i, "week");
      } else if (frequency === "monthly") {
        eventStartDate = startDate.add(i, "month");
        eventEndDate = endDate.add(i, "month");
      }

      occurrences.push({
        id: occurrences.length + 1,
        title: data.title,
        startDate: eventStartDate?.format("YYYY-MM-DD"),
        endDate: eventEndDate?.format("YYYY-MM-DD"),
        description: data.description,
        organizer: data.organizer,
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        isRecurring: true,
        recurringType: data.recurringType, // Add recurringType
        recurringCount: data.recurringCount,
      });
    }
    dispatch(addEvent(occurrences));
  };

  const showEventDetails = (event) => {
    console.log(event);

    setSelectedEvent(event);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedEvent(null);
  };

  // Watch the values of isRecurring and recurringType
  const isRecurring = watch("isRecurring");
  const recurringType = watch("recurringType");

  // Determine if event is daily recurring
  useEffect(() => {
    if (isRecurring) {
      setIsEventDailyRecurring(recurringType === "daily");
    } else {
      setIsEventDailyRecurring(false);
    }
  }, [isRecurring, recurringType]);

  // Custom validation functions
  const validateStartDate = (value) => {
    if (!value || dayjs(value).isBefore(dayjs(), "day")) {
      return "Start date must be today or a future date.";
    }
    return true;
  };

  const validateEndDate = (value, startDate) => {
    if (!value || dayjs(value).isBefore(dayjs(startDate))) {
      return "End date must be greater than the start date.";
    }
    return true;
  };

  // Disable dates functions
  const disableStartDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disableEndDate = (current) => {
    const startDate = watch("startDate");
    return current && startDate && current < dayjs(startDate).endOf("day");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>
      <Form
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        className="mb-6"
      >
        <Form.Item label="Event Title" required>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => <Input {...field} />}
          />
          {errors.title && (
            <span className="text-red-600">{errors.title.message}</span>
          )}
        </Form.Item>

        <Form.Item label="Recurring Event">
          <Controller
            name="isRecurring"
            control={control}
            render={({ field }) => (
              <Checkbox {...field} checked={field.value}>
                Yes
              </Checkbox>
            )}
          />
        </Form.Item>

        {isRecurring && (
          <>
            <Form.Item label="Recurring Type">
              <Controller
                name="recurringType"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select Recurring Type">
                    <Select.Option value="daily">Daily</Select.Option>
                    <Select.Option value="weekly">Weekly</Select.Option>
                    <Select.Option value="monthly">Monthly</Select.Option>
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item label="Number of Occurrences">
              <Controller
                name="recurringCount"
                control={control}
                rules={{
                  required: "Number of occurrences is required",
                  min: {
                    value: 1,
                    message: "Number of occurrences must be at least 1",
                  },
                }}
                render={({ field }) => <Input type="number" {...field} />}
              />
              {errors.recurringCount && (
                <span className="text-red-600 mt-1">
                  {errors.recurringCount.message}
                </span>
              )}
            </Form.Item>
          </>
        )}

        <div className="flex justify-start items-center gap-x-24">
          {isEventDailyRecurring ? (
            <>
              <Form.Item label="Start Date" required>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: "Date is required",
                    validate: validateStartDate,
                  }}
                  render={({ field }) => (
                    <DatePicker {...field} disabledDate={disableStartDate} />
                  )}
                />
                {errors.date && (
                  <span className="text-red-600">{errors.date.message}</span>
                )}
              </Form.Item>

              <Form.Item label="Start Time" className="hidden">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => <DatePicker.TimePicker {...field} />}
                />
                {errors.startTime && (
                  <span className="text-red-600">
                    {errors.startTime.message}
                  </span>
                )}
              </Form.Item>

              <Form.Item label="End Time" className="hidden">
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => <DatePicker.TimePicker {...field} />}
                />
                {errors.endTime && (
                  <span className="text-red-600">{errors.endTime.message}</span>
                )}
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="Start Date" required>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: "Start date is required",
                    validate: validateStartDate,
                  }}
                  render={({ field }) => (
                    <DatePicker {...field} disabledDate={disableStartDate} />
                  )}
                />
                {errors.startDate && (
                  <span className="text-red-600">
                    {errors.startDate.message}
                  </span>
                )}
              </Form.Item>

              <Form.Item label="End Date" required>
                <div className="flex flex-col justify-start">
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      required: "End date is required",
                      validate: (value) =>
                        validateEndDate(value, watch("startDate")),
                    }}
                    render={({ field }) => (
                      <DatePicker {...field} disabledDate={disableEndDate} />
                    )}
                  />
                  {errors.endDate && (
                    <span className="text-red-600 mt-1">
                      {errors.endDate.message}
                    </span>
                  )}
                </div>
              </Form.Item>

              <Form.Item label="Start Time" className="hidden">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => <DatePicker.TimePicker {...field} />}
                />
                {errors.startTime && (
                  <span className="text-red-600">
                    {errors.startTime.message}
                  </span>
                )}
              </Form.Item>

              <Form.Item label="End Time" className="hidden">
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => <DatePicker.TimePicker {...field} />}
                />
                {errors.endTime && (
                  <span className="text-red-600">{errors.endTime.message}</span>
                )}
              </Form.Item>
            </>
          )}
        </div>

        <Form.Item label="Organizer" required>
          <Controller
            name="organizer"
            control={control}
            rules={{ required: "Organizer is required" }}
            render={({ field }) => (
              <Select {...field} placeholder="Select Organizer">
                <Select.Option value="Academic Coordinator">
                  Academic Coordinator
                </Select.Option>
                <Select.Option value="Sports Coordinator">
                  Sports Coordinator
                </Select.Option>
                <Select.Option value="Exam Coordinator">
                  Exam Coordinator
                </Select.Option>
                <Select.Option value="Community and Social Events Coordinator">
                  Community and Social Events Coordinator
                </Select.Option>
              </Select>
            )}
          />
          {errors.organizer && (
            <span className="text-red-600">{errors.organizer.message}</span>
          )}
        </Form.Item>

        <Form.Item label="Event Type" required>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Event type is required" }}
            render={({ field }) => (
              <Select {...field} placeholder="Select Event Type">
                <Select.Option value="Academic">Academic</Select.Option>
                <Select.Option value="Sports">Sports</Select.Option>
                <Select.Option value="Extracurricular">
                  Extracurricular
                </Select.Option>
                <Select.Option value="SocialEvents">
                  Community and Social Events
                </Select.Option>
              </Select>
            )}
          />
          {errors.type && (
            <span className="text-red-600">{errors.type.message}</span>
          )}
        </Form.Item>

        <Form.Item label="Description" required>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => <Input.TextArea {...field} />}
          />
          {errors.description && (
            <span className="text-red-600">{errors.description.message}</span>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Event
          </Button>
        </Form.Item>
      </Form>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Upcoming Events",
            children: (
              <List
                itemLayout="horizontal"
                dataSource={upcomingEvents}
                renderItem={(event) => (
                  <List.Item onClick={() => showEventDetails(event)}>
                    <List.Item.Meta
                      title={event.title}
                      description={event.description}
                    />
                    <div>
                      <p>{`${
                        event.endDate
                          ? `${dayjs(event.startDate).format(
                              "DD/MM/YYYY"
                            )} - ${dayjs(event.endDate).format("DD/MM/YYYY")}`
                          : `${dayjs(event.startDate).format("DD/MM/YYYY")}`
                      }`}</p>
                    </div>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "2",
            label: "Past Events",
            children: (
              <List
                itemLayout="horizontal"
                dataSource={pastEvents}
                renderItem={(event) => (
                  <List.Item onClick={() => showEventDetails(event)}>
                    <List.Item.Meta
                      title={event.title}
                      description={event.description}
                    />
                    <div>
                      <p>{`${
                        event.endDate
                          ? `${dayjs(event.startDate).format(
                              "DD/MM/YYYY"
                            )} - ${dayjs(event.endDate).format("DD/MM/YYYY")}`
                          : `${dayjs(event.startDate).format("DD/MM/YYYY")}`
                      }`}</p>
                    </div>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "3",
            label: "Active Events",
            children: (
              <List
                itemLayout="horizontal"
                dataSource={activeEvents}
                renderItem={(event) => (
                  <List.Item onClick={() => showEventDetails(event)}>
                    <List.Item.Meta
                      title={event.title}
                      description={event.description}
                    />
                    <div>
                      <p>{`${
                        event.endDate
                          ? `${dayjs(event.startDate).format(
                              "DD/MM/YYYY"
                            )} - ${dayjs(event.endDate).format("DD/MM/YYYY")}`
                          : `${dayjs(event.startDate).format("DD/MM/YYYY")}`
                      }`}</p>
                    </div>
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />

      <Modal
        title="Event Details"
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedEvent && (
          <div>
            <h3>{selectedEvent.title}</h3>
            <p>{selectedEvent.description}</p>
            <p>Organizer: {selectedEvent.organizer}</p>
            <p>Type: {selectedEvent.type}</p>
            <p>
              Start Date: {dayjs(selectedEvent.startDate).format("DD/MM/YYYY")}
            </p>
            <p>
              End Date:{" "}
              {`${
                selectedEvent.endDate
                  ? `${dayjs(selectedEvent.endDate).format("DD/MM/YYYY")}`
                  : ""
              }`}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventManagement;
