import { Tabs, Card, Table } from "antd";
import { useSelector } from "react-redux";
import { useState } from "react";
import SearchWithSuggestions from "../Total Students/SearchWithSuggestions";

const TeacherDetails = () => {
  const { users } = useSelector((state) => state.allUsers);
  const { teachers } = useSelector((state) => state.allTeachers);
  const { classes } = useSelector((state) => state.allClasses);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherClassDetails, setTeacherClassDetails] = useState([]);

  const handleUserSelect = (user) => {
    const teacher = teachers?.find((teacher) => teacher.userId === user._id);
    setSelectedTeacher(teacher || null);

    // Get classes assigned to this teacher
    const assignedClasses = classes?.filter(
      (classItem) => classItem.classTeacher === teacher?._id
    );
    setTeacherClassDetails(assignedClasses);

    setSelectedUser(user || null);
  };

  const teacherInfo =
    selectedUser && selectedTeacher
      ? [
          { key: 1, field: "Teacher Name", value: selectedUser.fullName },
          { key: 2, field: "Teacher ID", value: selectedTeacher.teacherId },
          {
            key: 3,
            field: "Subject Specialization",
            value: selectedTeacher.subjectSpecialization,
          },
          {
            key: 4,
            field: "Employment Date",
            value: new Date(
              selectedTeacher.employmentDate
            ).toLocaleDateString(),
          },
          {
            key: 5,
            field: "Assigned Classes",
            value: teacherClassDetails.map((c) => c.className).join(", "),
          },
        ]
      : [];

  const columns = [
    { title: "Field", dataIndex: "field", key: "field" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const items = [
    {
      label: "Basic Information",
      key: "1",
      children: (
        <Card
          title={
            <SearchWithSuggestions
              onUserSelect={handleUserSelect}
              role="teacher"
            />
          }
        >
          <Table
            dataSource={teacherInfo}
            columns={columns}
            pagination={false}
          />
        </Card>
      ),
    },
    {
      label: "Assigned Classes",
      key: "2",
      children: (
        <Card title="Class Assignments">
          {teacherClassDetails.length > 0 ? (
            teacherClassDetails.map((classItem) => (
              <p key={classItem._id}>{classItem.className}</p>
            ))
          ) : (
            <p>No classes assigned to this teacher.</p>
          )}
        </Card>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default TeacherDetails;
