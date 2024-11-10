import React, { useEffect, useState } from "react";
import { Row, Col, Select, Button, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const ReportsComponent = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { userInfo } = useSelector((state) => state.user);
  const { classes } = useSelector((state) => state.allClasses);

  const dispatch = useDispatch();

  const handleReportTypeChange = (value) => {
    setSelectedReport(value);
    setSelectedRole(null);
    setSelectedClass(null);
    setSelectedGrade(null);
    setSelectedSection(null);
    setSelectedDepartment(null);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setSelectedClass(null);
    setSelectedGrade(null);
    setSelectedSection(null);
    setSelectedDepartment(null);
  };


  // const fetchChartData = () => {
  //   if (startDate && endDate && endDate.isAfter(startDate)) {
  //     console.log("Fetching data for:", {
  //       report: selectedReport,
  //       role: selectedRole,
  //       class: selectedClass,
  //       startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
  //       endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
  //     });

  //     if (report === "attendance" && role === "admin") {
  //       dispatch(fetchPaginatedAttendance());
  //     }
  //   }
  // };

  const fetchReports = () => {
    fetchChartData();
  };

  // Role-based report options
  const reportOptionsByRole = {
    superAdmin: [
      { value: "attendanceOverview", label: "Attendance Overview" },
      { value: "financialReports", label: "Financial Reports" },
      { value: "performanceAnalytics", label: "Performance Analytics" },
      { value: "eventManagement", label: "Event Management" },
      {
        value: "behavioralDisciplinary",
        label: "Behavioral and Disciplinary Analysis",
      },
      { value: "resourceUsage", label: "Resource Usage" },
      { value: "teacherStaffReports", label: "Teacher and Staff Reports" },
      { value: "systemHealth", label: "System Health and Data Analytics" },
    ],
    admin: [
      {
        value: "attendanceDepartment",
        label: "Attendance by Department/Class",
      },
      { value: "feeCollectionGrade", label: "Fee Collection by Grade" },
      { value: "disciplinaryReports", label: "Disciplinary Reports" },
      { value: "classPerformance", label: "Class Performance Reports" },
      { value: "eventReports", label: "Event Reports" },
    ],
    teacher: [
      {
        value: "classAttendancePatterns",
        label: "Class Attendance & Patterns",
      },
      { value: "studentPerformance", label: "Student Performance Reports" },
      { value: "classDisciplinary", label: "Disciplinary Actions for Class" },
      {
        value: "assignmentCompletion",
        label: "Homework & Assignment Completion",
      },
      {
        value: "parentTeacherMeetings",
        label: "Parent-Teacher Meeting Records",
      },
    ],
    student: [
      { value: "personalAttendance", label: "Personal Attendance" },
      { value: "academicPerformance", label: "Academic Performance" },
      {
        value: "behavioralDisciplinary",
        label: "Behavioral & Disciplinary Actions",
      },
      { value: "upcomingEvents", label: "Upcoming Events and Deadlines" },
      { value: "libraryUsage", label: "Library & Resource Usage" },
    ],
  };

  const renderReportOptions = () => {
    const options = reportOptionsByRole[userInfo?.role] || [];
    return options.map((option) => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ));
  };

  return (
    <div className="p-5">
      <Row gutter={[16, 16]} align="middle" wrap={true}>
        <Col>
          <Select
            placeholder="Select Report"
            onChange={handleReportTypeChange}
            className="w-52"
          >
            {renderReportOptions()}
          </Select>
        </Col>

        <Col>
          <Select
            placeholder="Select Role"
            onChange={handleRoleChange}
            className="w-40"
            value={selectedRole}
          >
            <Option value="admin">Admin</Option>
            <Option value="teacher">Teacher</Option>
            <Option value="student">Student</Option>
          </Select>
        </Col>

        <Col>
          <DatePicker
            placeholder="Start Date"
            onChange={setStartDate}
            className="w-52 mr-2"
          />
        </Col>

        <Col>
          <DatePicker
            placeholder="End Date"
            onChange={setEndDate}
            className="w-52"
            disabledDate={(current) =>
              startDate && current && current.isBefore(startDate, "day")
            }
          />
        </Col>

        <Col>
          <Button type="primary" onClick={fetchReports}>
            Generate Report
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsComponent;
