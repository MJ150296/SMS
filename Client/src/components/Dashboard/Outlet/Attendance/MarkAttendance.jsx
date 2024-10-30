import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Tag,
  message,
  Modal,
  Input,
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const AttendanceMarking = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { classes } = useSelector((state) => state.allClasses);
  const { teachers } = useSelector((state) => state.allTeachers);
  const { admins } = useSelector((state) => state.allAdmins);
  const { users } = useSelector((state) => state.allUsers);
  const { students } = useSelector((state) => state.allStudents);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [absenceReason, setAbsenceReason] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedDropdownValue, setSelectedDropdownValue] = useState();
  const [studentsList, setStudentsList] = useState();
  const [attendance, setAttendance] = useState({});
  const [defaultClassSelected, setDefaultClassSelected] = useState();

  const [selectedClassDropdownValue, seteSelectedClassDropdownValue] =
    useState();
  const [isClassDropdownVisible, setIsClassDropdownVisible] = useState(false);

  // Set default dropdown value based on role

  ////////////////////////////////////////////////////////////////////////////////////////
  //
  //                    This page is configured according to teacher default value in case of admin and super admin
  //                    and class in case of teacher

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "superAdmin" || userInfo.role === "admin") {
        setSelectedDropdownValue("teacher");
      } else if (userInfo.role === "teacher" && dropdownOptions?.length > 0) {
        setSelectedDropdownValue(dropdownOptions[0]?.value);
      }
    }
  }, [userInfo]);

  const handleStudentListFromSelectedClass = (selectedClassDropdownValue) => {
    if (selectedClassDropdownValue) {
      // console.log("selectedClass", selectedClassDropdownValue);
      // Split selected class and section
      const [onlyClass, onlySection] = selectedClassDropdownValue.split("-");
      // console.log("class", onlyClass, "section", onlySection);

      // Find the selected class details
      const classDetails = classes.filter(
        (classItem) =>
          classItem.className === onlyClass && classItem.section === onlySection
      );

      // Check if classDetails has any entries
      if (classDetails.length > 0) {
        const studentsIdOfClass = classDetails[0].students;
        // console.log("classDetails", classDetails);
        // console.log("studentsIdOfClass", studentsIdOfClass);

        // Get student details of the specific class
        const studentDetailsOfAClass = students.filter((student) =>
          studentsIdOfClass.includes(student._id)
        );
        // console.log("studentDetailsOfAClass", studentDetailsOfAClass);

        // Use a Set for faster lookup of user IDs
        const studentUserIds = new Set(
          studentDetailsOfAClass.map((student) => student.userId)
        );

        // Get user details for each student in the class
        const studentUserDetails = users.filter((user) =>
          studentUserIds.has(user._id)
        );
        // console.log("studentUserDetails", studentUserDetails);

        const studentsForStudentList = studentUserDetails.map((user) => {
          return {
            id: user._id,
            name: user ? user.fullName : "Unknown",
          };
        });

        // console.log(studentsForStudentList);
        setStudentsList(studentsForStudentList);
      } else {
        console.log(
          "No class details found for the selected class and section."
        );
      }
    }
  };

  // Below useEffect is for superAdmin OR Admin role looged In
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "superAdmin" || userInfo.role === "admin") {
        if (selectedDropdownValue === "admin") {
          if (admins && admins.length > 0 && users && users.length > 0) {
            const adminUserDetail = admins.map((admin) => {
              const user = users.find(
                (u) => u._id === admin.userId && u.role === "admin"
              );
              return {
                id: admin._id,
                name: user ? user.fullName : "Unknown",
              };
            });

            // console.log(adminUserDetail);
            setStudentsList(adminUserDetail);
          }
        } else if (selectedDropdownValue === "student") {
          console.log(selectedClassDropdownValue);

          if (selectedClassDropdownValue) {
            // console.log("selectedClass", selectedClassDropdownValue);
            handleStudentListFromSelectedClass(selectedClassDropdownValue);
          }
        } else {
          if (teachers && teachers.length > 0 && users && users.length > 0) {
            const teachersUserDetail = teachers.map((teacher) => {
              const user = users.find(
                (u) => u._id === teacher.userId && u.role === "teacher"
              );
              return {
                id: teacher.teacherId,
                name: user ? user.fullName : "Unknown",
              };
            });

            // console.log(teachersUserDetail);
            setStudentsList(teachersUserDetail);
          }
        }
      }
    }
  }, [
    teachers,
    users,
    admins,
    selectedDropdownValue,
    selectedClassDropdownValue,
  ]);

  useEffect(() => {
    // Mark default PRESENT for ALL. student is just a name
    if (studentsList?.length > 0) {
      const initialAttendance = {};
      studentsList?.forEach((student) => {
        initialAttendance[student.id] = { status: "Present", note: "" };
      });
      setAttendance(initialAttendance);
    }
  }, [studentsList]);

  const handleDateChange = (date) => setSelectedDate(date);

  const handleAttendance = (studentId, status) => {
    if (status === "absent") {
      setSelectedStudent(studentId);
      setIsModalVisible(true);
    } else {
      setAttendance((prev) => ({
        ...prev,
        [studentId]: {
          status,
          reason: status === "approved leave" ? "Approved Leave" : "",
        },
      }));
    }
  };

  const handleDropdownChange = (value) => {
    setSelectedDropdownValue(value);
    if (userInfo.role === "teacher") {
      handleStudentListFromSelectedClass(value);
    }
    if (value === "student") {
      setIsClassDropdownVisible(true);
    } else {
      setIsClassDropdownVisible(false);
    }
  };

  const handleClassDropdownChange = (value) => {
    seteSelectedClassDropdownValue(value);
  };

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
  };

  useEffect(() => {
    //  To get the student list of assigned class when logged in as teacher
    if (dropdownOptions) {
      console.log("dropdownOptions", dropdownOptions);
      handleStudentListFromSelectedClass(dropdownOptions[0]?.value);
    }
  }, []);

  const getDropdownOptions = () => {
    if (!userInfo) return [];
    switch (userInfo.role) {
      case "superAdmin":
      case "admin":
        return [
          { value: "admin", label: "Admin" },
          { value: "teacher", label: "Teacher" },
          { value: "student", label: "Student" },
        ];
      case "teacher":
        const teacherId = teachers.find(
          (teacher) => teacher.userId === userInfo._id
        )?._id;
        const assignedClasses = classes?.filter(
          (classItem) => classItem.classTeacher === teacherId
        );
        // setDefaultClassSelected(assignedClasses);
        const otherClasses = classes?.filter(
          (classItem) => classItem.classTeacher !== teacherId
        );
        return [...assignedClasses, ...otherClasses].map((classItem) => ({
          value: `${classItem.className}-${classItem.section}`,
          label: `${classItem.className} - ${classItem.section}`,
        }));
      default:
        return [];
    }
  };

  const dropdownOptions = getDropdownOptions();

  const getClassDropdownOptions = () => {
    if (classes?.length > 0) {
      const classDropdown = classes.map((classItem) => ({
        value: `${classItem.className}-${classItem.section}`,
        label: `${classItem.className} - ${classItem.section}`,
      }));
      return classDropdown;
    }
  };

  const classDropdownOptions = getClassDropdownOptions();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div className="flex justify-between items-center my-2">
        <h2 className="text-lg font-semibold">Mark Attendance</h2>
        <div className="flex justify-end items-center gap-x-5">
          <Select
            value={selectedDropdownValue}
            onChange={handleDropdownChange}
            style={{ width: 120 }}
            className="m-2"
            options={dropdownOptions}
          />
          {isClassDropdownVisible && (
            <div className="flex gap-x-2 items-center">
              <p>Class:</p>
              <Select
                value={selectedClassDropdownValue}
                onChange={handleClassDropdownChange}
                style={{ width: 120 }}
                className="m-2"
                options={classDropdownOptions}
              />
            </div>
          )}
        </div>
      </div>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginBottom: "20px", width: "100%" }}
      />
      <List
        itemLayout="horizontal"
        dataSource={studentsList}
        renderItem={(student) => (
          <List.Item
            actions={[
              <Button
                type={
                  attendance[student.id]?.status === "Present"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleAttendance(student.id, "Present")}
              >
                Present
              </Button>,
              <Button
                type={
                  attendance[student.id]?.status === "absent"
                    ? "primary"
                    : "default"
                }
                danger={attendance[student.id]?.status === "absent"}
                onClick={() => handleAttendance(student.id, "absent")}
              >
                Absent
              </Button>,
              <Button
                type={
                  attendance[student.id]?.status === "late"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleAttendance(student.id, "late")}
              >
                Late
              </Button>,
              <Button
                type={
                  attendance[student.id]?.status === "approved leave"
                    ? "primary"
                    : "default"
                }
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
        )}
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
