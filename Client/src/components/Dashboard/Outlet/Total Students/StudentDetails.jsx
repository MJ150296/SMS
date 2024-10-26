import { Tabs, Card, Table } from "antd";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SearchWithSuggestions from "./SearchWithSuggestions.jsx";

const StudentDetails = () => {
  const { users } = useSelector((state) => state.allUsers);
  const { students, error } = useSelector((state) => state.allStudents);
  const { classes } = useSelector((state) => state.allClasses);
  const { teachers, isLoading } = useSelector((state) => state.allTeachers);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classTeacherDetails, setClassTeacherDetails] = useState(null);
  const [classTeacherUserProfile, setClassTeacherUserProfile] = useState(null);

  const handleUserSelect = (user) => {
    const student = students?.find((student) => student.userId === user._id);
    setSelectedStudent(student || null);

    const selectedClass = classes?.find(
      (data) => data._id === student?.classEnrolled
    );

    setSelectedClass(selectedClass); //Local variable passed
    console.log("selected class", selectedClass);
    console.log("selected student", student);

    const classTeacher = teachers?.find(
      (teacher) => teacher._id === selectedClass.classTeacher
    );
    setClassTeacherDetails(classTeacher);
    console.log("class teacher", classTeacher);

    const classTeacherUserProfile = users?.find(
      (user) => user._id === classTeacher.userId
    );
    setClassTeacherUserProfile(classTeacherUserProfile);

    console.log("class teacher user", classTeacherUserProfile);

    setSelectedUser(user || null);
    console.log("Selected User:", user);
  };

  const columns = [
    { title: "Field", dataIndex: "field", key: "field" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const studentInfo =
    selectedUser && selectedStudent
      ? [
          { key: 1, field: "Student Name", value: selectedUser.fullName },
          { key: 2, field: "Student ID", value: selectedStudent.studentId },
          {
            key: 3,
            field: "Class & Section",
            value: `${selectedClass.className || ""} - ${
              selectedStudent.section
            }`,
          },
          { key: 4, field: "Roll Number", value: selectedStudent.rollNumber },
          {
            key: 5,
            field: "Class Teacher",
            value: classTeacherUserProfile.fullName || "",
          },
          {
            key: 6,
            field: "Date of Birth",
            value: new Date(selectedStudent.dateOfBirth).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ), // Outputs as "January 1, 2000"
          },
          {
            key: 7,
            field: "Date of Admission",
            value:
              new Date(selectedStudent.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) +
              " - " +
              new Date(selectedStudent.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }) +
              "." +
              new Date(selectedStudent.createdAt).getMilliseconds(),
          },
        ]
      : [];

  const attendanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Attendance %",
        data: [90, 85, 92, 88, 95],
        borderColor: "#4caf50",
        fill: false,
      },
    ],
  };

  const items = [
    {
      label: "Basic Information",
      key: "1",
      children: (
        <Card
          title={
            <div className="w-full flex justify-start items-center">
              <div className="w-1/3">
                <SearchWithSuggestions onUserSelect={handleUserSelect} role="student"/>
              </div>
              {/* <span>Student Basic Information</span> */}
            </div>
          }
          className="mb-4"
        >
          <div className="flex">
            {/* Table: 70% */}
            <div
              className={`${
                selectedUser && selectedStudent ? "w-4/5" : "w-full"
              }`}
            >
              <Table
                dataSource={studentInfo}
                columns={columns}
                pagination={false}
              />
            </div>

            {/* Images: 30% */}
            <div
              className={`${
                selectedUser && selectedStudent ? "w-2/5" : "w-0"
              } flex flex-col items-end justify-start`}
            >
              {/* Student Image */}
              <div className="w-full mb-4">
                <img
                  src={
                    selectedUser?.avatarUrl ||
                    "https://res.cloudinary.com/dzmjjm2kn/image/upload/v1729203068/smsLogo_xnewfo.jpg"
                  }
                  alt="Student"
                  className="w-4/5 rounded-lg shadow-md"
                />
              </div>

              {/* Class Teacher Image */}
              {/* <div className="w-full">
                <img
                  src={
                    selectedStudent?.classTeacherImageUrl ||
                    "https://res.cloudinary.com/dzmjjm2kn/image/upload/v1729203068/smsLogo_xnewfo.jpg"
                  }
                  alt="Class Teacher"
                  className="w-4/5 rounded-lg shadow-md"
                />
              </div> */}
            </div>
          </div>
        </Card>
      ),
    },
    {
      label: "Academic Information",
      key: "2",
      children: (
        <Card title="Academic Performance">
          {selectedStudent ? (
            <>
              <p>Class Enrolled: {selectedStudent.class}</p>
              <p>Subjects Taken: {selectedStudent?.subjects || "Subjects"}</p>
              <p>GPA: {selectedStudent?.gpa || "GPA"}</p>
            </>
          ) : (
            <p>No student selected.</p>
          )}
        </Card>
      ),
    },
    {
      label: "Attendance",
      key: "3",
      children: (
        <Card title="Attendance Overview">
          <Line data={attendanceData || ""} />
        </Card>
      ),
    },
    {
      label: "Fee Details",
      key: "4",
      children: (
        <Card title="Fee Payment Status">
          {selectedStudent ? (
            <>
              <p>Status: {selectedStudent?.feeStatus || "Fee status"}</p>
              <p>Due Amount: {selectedStudent.dueAmount || "Due amount"}</p>
            </>
          ) : (
            <p>No student selected.</p>
          )}
        </Card>
      ),
    },
    {
      label: "Behavioral Info",
      key: "5",
      children: (
        <Card title="Disciplinary Reports">
          {selectedStudent ? (
            <>
              <p>
                Behavioral Reports:{" "}
                {selectedStudent?.behavioralReports || "Behavioral Reports"}
              </p>
              <p>
                Teacher Comments:{" "}
                {selectedStudent?.teacherComments || "Teacher Comments"}
              </p>
            </>
          ) : (
            <p>No student selected.</p>
          )}
        </Card>
      ),
    },
    {
      label: "Parent Info",
      key: "6",
      children: (
        <Card title="Parent Information">
          {selectedStudent ? (
            <div className="text-base space-y-4">
              <p>
                Contact Number:{" "}
                {selectedStudent?.guardianDetails?.contactNumber || "N/A"}
              </p>
              <p>
                Father's Name:{" "}
                {selectedStudent?.guardianDetails?.fatherName || "N/A"}
              </p>
              <p>
                Mother's Name:{" "}
                {selectedStudent?.guardianDetails?.motherName || "N/A"}
              </p>
              <p>Guardian's Name: {selectedStudent?.guardianName || "N/A"}</p>
              <p>Email: {selectedStudent?.parentEmail || "N/A"}</p>
              <p>
                Address:{" "}
                {selectedStudent?.guardianDetails?.address
                  ? `${selectedStudent.guardianDetails.address.street}, ${selectedStudent.guardianDetails.address.city}, ${selectedStudent.guardianDetails.address.state}, ${selectedStudent.guardianDetails.address.postalCode}`
                  : "N/A"}
              </p>{" "}
              <p>Occupation: {selectedStudent?.parentOccupation || "N/A"}</p>
              <p>
                Emergency Contact:{" "}
                {selectedStudent?.emergencyContact ||
                  selectedStudent?.guardianDetails?.contactNumber ||
                  "N/A"}
              </p>
            </div>
          ) : (
            <p>No student selected.</p>
          )}
        </Card>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default StudentDetails;
