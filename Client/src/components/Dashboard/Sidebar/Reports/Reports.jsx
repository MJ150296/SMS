import React, { useState } from 'react';
import { Row, Col, Select, Button, DatePicker } from 'antd';

const { Option } = Select;

const ReportsComponent = () => {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [selectedClass, setSelectedClass] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleReportTypeChange = (value) => {
    setSelectedReport(value);
    setSelectedClass(null); // Reset class selection when report type changes
  };

  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  const fetchChartData = () => {
    // Logic to fetch chart data based on selectedReport, selectedClass, startDate, and endDate
    console.log('Fetching data for:', {
      report: selectedReport,
      class: selectedClass,
      startDate,
      endDate,
    });
  };

  // Sub-options based on the selected report
  const renderSubOptions = () => {
    switch (selectedReport) {
      case 'attendance':
        return (
          <Select
            placeholder="Select Class"
            onChange={handleClassChange}
            style={{ width: 150 }}
          >
            <Option value="class-1">Class 1</Option>
            <Option value="class-2">Class 2</Option>
            <Option value="class-3">Class 3</Option>
            {/* Add more classes as needed */}
          </Select>
        );
      case 'fees':
        return (
          <Select
            placeholder="Select Fee Type"
            onChange={handleClassChange}
            style={{ width: 150 }}
          >
            <Option value="tuition">Tuition Fees</Option>
            <Option value="library">Library Fees</Option>
            <Option value="sports">Sports Fees</Option>
          </Select>
        );
      case 'performance':
        return (
          <Select
            placeholder="Select Subject"
            onChange={handleClassChange}
            style={{ width: 150 }}
          >
            <Option value="math">Mathematics</Option>
            <Option value="science">Science</Option>
            <Option value="english">English</Option>
          </Select>
        );
      case 'events':
        return (
          <Select
            placeholder="Select Event Type"
            onChange={handleClassChange}
            style={{ width: 150 }}
          >
            <Option value="sports">Sports Day</Option>
            <Option value="annual">Annual Day</Option>
            <Option value="field-trip">Field Trip</Option>
          </Select>
        );
      case 'discipline':
        return (
          <Select
            placeholder="Select Discipline Type"
            onChange={handleClassChange}
            style={{ width: 150 }}
          >
            <Option value="violations">Violations</Option>
            <Option value="awards">Awards</Option>
            <Option value="warnings">Warnings</Option>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* <h2>Reports</h2> */}
      <Row gutter={16}>
        <Col>
          <Select
            defaultValue="attendance"
            onChange={handleReportTypeChange}
            style={{ width: 150 }}
          >
            <Option value="attendance">Attendance</Option>
            <Option value="fees">Fees Collection</Option>
            <Option value="performance">Performance</Option>
            <Option value="events">Events</Option>
            <Option value="discipline">Disciplinary Reports</Option>
          </Select>
        </Col>
        <Col>
          {renderSubOptions()} {/* Render sub-options based on selected report */}
        </Col>
        <Col>
          <DatePicker
            placeholder="Start Date"
            onChange={setStartDate}
            style={{ width: 200, marginRight: 8 }}
          />
          <DatePicker
            placeholder="End Date"
            onChange={setEndDate}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={fetchChartData}>
            Generate Report
          </Button>
        </Col>
      </Row>
      {/* Below this would be the filtered/sorted chart */}
    </div>
  );
};

export default ReportsComponent;
