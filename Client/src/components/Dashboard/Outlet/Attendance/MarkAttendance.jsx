import React, { useEffect, useRef, useState } from "react";
import { List, Button, Tag, message, Modal, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const studentsList = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
];

const AttendanceMarking = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [absenceReason, setAbsenceReason] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedClass, setSelectedClass] = useState();

  // Initialize attendance with "Present" as default
  const initializeAttendance = () => {
    const initialAttendance = {};
    studentsList.forEach((student) => {
      initialAttendance[student.id] = { status: "Present", note: "" };
    });
    return initialAttendance;
  };

  const [attendance, setAttendance] = useState(initializeAttendance());

  const handleDateChange = (date) => setSelectedDate(date);
  
  const handleAttendance = (studentId, status) => {
    if (status === "absent") {
      setSelectedStudent(studentId);
      setIsModalVisible(true);
    } else {
      setAttendance((prev) => ({
        ...prev,
        [studentId]: { status, reason: status === "approved leave" ? "Approved Leave" : "" },
      }));
    }
  };

  const handleClassChange = (value) => setSelectedClass(value);

  const handleModalOk = () => {
    setAttendance((prev) => ({
      ...prev,
      [selectedStudent]: { status: "absent", reason: absenceReason },
    }));
    setIsModalVisible(false);
    setAbsenceReason("");
  };

  const handleSubmit = () => {
    message.success("Attendance submitted successfully!");
    console.log("Attendance Data:", { date: selectedDate, attendance });
    // Send the attendance data to backend if needed
  };

  const getDropdownOptions = () => {
    switch (userInfo?.role) {
      case "superAdmin":
      case "admin":
        return [
          { value: "admin", label: "Admin" },
          { value: "teacher", label: "Teacher" },
          { value: "student", label: "Student" },
        ];
      case "teacher":
        return [
          { value: "1-A", label: "Class 1-A" },
          { value: "1-B", label: "Class 1-B" },
        ];
      default:
        return [];
    }
  };

  const dropdownOptions = getDropdownOptions();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div className="flex justify-between items-center my-2">
        <h2 className="text-lg font-semibold">Mark Attendance</h2>
        <Select
          value={selectedClass}
          onChange={handleClassChange}
          style={{ width: 120 }}
          className="m-2"
          options={dropdownOptions}
        />
      </div>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginBottom: "20px", width: "100%" }}
      />
      <List
        itemLayout="horizontal"
        dataSource={studentsList}
        renderItem={(student) => {
          const presentButtonRef = useRef(null);

          useEffect(() => {
            if (attendance[student.id]?.status === "Present") {
              presentButtonRef.current?.focus();
            }
          }, [attendance[student.id]?.status, student.id]);

          return (
            <List.Item
              actions={[
                <Button
                  type={attendance[student.id]?.status === "Present" ? "primary" : "default"}
                  onClick={() => handleAttendance(student.id, "Present")}
                  ref={presentButtonRef}
                >
                  Present
                </Button>,
                <Button
                  type={attendance[student.id]?.status === "absent" ? "primary" : "default"}
                  danger={attendance[student.id]?.status === "absent"}
                  onClick={() => handleAttendance(student.id, "absent")}
                >
                  Absent
                </Button>,
                <Button
                  type={attendance[student.id]?.status === "late" ? "primary" : "default"}
                  onClick={() => handleAttendance(student.id, "late")}
                >
                  Late
                </Button>,
                <Button
                  type={attendance[student.id]?.status === "approved leave" ? "primary" : "default"}
                  onClick={() => handleAttendance(student.id, "approved leave")}
                >
                  Approved Leave
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={student.name}
                description={
                  attendance[student.id] ? (
                    <>
                      <Tag
                        color={
                          attendance[student.id].status === "Present"
                            ? "green"
                            : attendance[student.id].status === "absent"
                            ? "red"
                            : attendance[student.id].status === "late"
                            ? "gold"
                            : "blue"
                        }
                      >
                        {attendance[student.id]?.status.toUpperCase()}
                      </Tag>
                      {attendance[student.id].reason && (
                        <span
                          style={{
                            display: "block",
                            marginLeft: "10px",
                            color: "gray",
                          }}
                        >
                          Reason: {attendance[student.id].reason}
                        </span>
                      )}
                    </>
                  ) : (
                    "Not marked"
                  )
                }
              />
            </List.Item>
          );
        }}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "20px", width: "100%" }}
      >
        Submit Attendance
      </Button>
      <Modal
        title="Reason for Absence"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter reason for absence"
          value={absenceReason}
          onChange={(e) => setAbsenceReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AttendanceMarking;
