import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
} from "antd";

const ClassScheduleTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [numberOfPeriods, setNumberOfPeriods] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const subjectOptions = ["English", "Hindi", "Maths", "Science"]; // Hardcoded subjects

  // Open modal when clicking "Add Schedule"
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission to create the table
  const onModalSubmit = () => {
    if (!className || isNaN(className) || className < 1 || className > 12) {
      message.error("Class name should be between 1 and 12");
      return; // Prevent modal from closing if validation fails
    }

    if (numberOfPeriods < 1 || numberOfPeriods > 8) {
      message.error("Number of periods should be between 1 and 8");
      return; // Prevent modal from closing if validation fails
    }

    const newScheduleData = Array.from({ length: daysOfWeek.length }, () =>
      Array(numberOfPeriods).fill("")
    );

    setScheduleData(newScheduleData);
    closeModal();
    message.success("Schedule created successfully!");
  };

  // Handle table cell change (subject input for each period)
  const handleCellChange = (dayIndex, periodIndex, value) => {
    const updatedScheduleData = [...scheduleData];
    updatedScheduleData[dayIndex][periodIndex] = value;
    setScheduleData(updatedScheduleData);
  };
  // Define table columns based on the number of periods
  const columns = Array.from({ length: numberOfPeriods }, (_, index) => ({
    title: `Period ${index + 1}`,
    dataIndex: `period-${index}`,
    key: `period-${index}`,
    render: (_, record, rowIndex) => (
      <Select
        value={record[rowIndex]}
        onChange={(value) => handleCellChange(rowIndex, index, value)}
        placeholder="Select Subject"
        style={{ width: "100%" }}
      >
        {subjectOptions.map((subject, idx) => (
          <Select.Option key={idx} value={subject}>
            {subject}
          </Select.Option>
        ))}
      </Select>
    ),
  }));

  // Add the weekdays as rows in the table
  const dataSource = scheduleData.map((daySchedule, index) => ({
    key: index,
    day: daysOfWeek[index],
    ...daySchedule.reduce((acc, period, idx) => {
      acc[`period-${idx}`] = period;
      return acc;
    }, {}),
  }));

  return (
    <div className="overflow-x-scroll md:w-[800px] lg:w-[1300px]">
      <Button type="primary" onClick={openModal}>
        Add Schedule
      </Button>

      {/* Dynamic table for timetable */}
      {numberOfPeriods > 0 && (
        <Table
          dataSource={dataSource}
          columns={[{ title: "Day", dataIndex: "day", key: "day" }, ...columns]}
          rowKey="key"
          bordered
          pagination={false}
          className="mt-4"
          scroll={{ x: "max-content" }} // This will allow the table to scroll horizontally
        />
      )}

      {/* Modal for adding schedule */}
      <Modal
        title="Add Schedule"
        open={isModalOpen}
        onCancel={closeModal}
        onOk={onModalSubmit}
      >
        <Form layout="vertical">
          <Form.Item
            label="Class Name"
            rules={[{ required: true, message: "Class Name is required" }]} // Adding required validation rule
          >
            <Input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
            />
          </Form.Item>

          <Form.Item label="Number of Periods" required>
            <Select
              value={numberOfPeriods}
              onChange={(value) => setNumberOfPeriods(value)}
              placeholder="Select number of periods"
            >
              <Select.Option value={1}>1 Period</Select.Option>
              <Select.Option value={2}>2 Periods</Select.Option>
              <Select.Option value={3}>3 Periods</Select.Option>
              <Select.Option value={4}>4 Periods</Select.Option>
              <Select.Option value={5}>5 Periods</Select.Option>
              <Select.Option value={6}>6 Periods</Select.Option>
              <Select.Option value={7}>7 Periods</Select.Option>
              <Select.Option value={8}>8 Periods</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassScheduleTab;
