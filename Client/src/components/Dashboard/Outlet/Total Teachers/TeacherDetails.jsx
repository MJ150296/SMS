import { Tabs, Card, Table, List, Button, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SearchWithSuggestions from "../Total Students/SearchWithSuggestions";
import { updateClassTeacher } from "../../../../Redux/slices/classSlice.js";

const TeacherDetails = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.allUsers);
  const { teachers } = useSelector((state) => state.allTeachers);
  const { classes } = useSelector((state) => state.allClasses);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherClassDetails, setTeacherClassDetails] = useState([]);
  const [classTeacherList, setClassTeacherList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [newTeacherId, setNewTeacherId] = useState("");

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

  const handleUpdateTeacher = (classItem) => {
    setCurrentClass(classItem);
    setIsModalVisible(true);
    setNewTeacherId(""); // Reset new teacher ID
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentClass(null);
    setNewTeacherId(""); // Reset new teacher ID
  };

  const handleUpdateSubmit = async () => {
    if (currentClass && newTeacherId) {
      try {
        await dispatch(
          updateClassTeacher({
            classId: currentClass.classId,
            teacherId: newTeacherId,
          })
        );
        closeModal(); // Close modal after dispatch
      } catch (error) {
        // Handle error (e.g., show a notification)
        console.error("Error updating teacher:", error);
      }
    }
  };

  useEffect(() => {
    if (classes) {
      setClassTeacherList(
        classes.map((classItem) => {
          const classTeacher = teachers.find(
            (teacher) => teacher._id === classItem.classTeacher
          );

          // Find the user's full name from the allUsers list
          const teacherUser = users.find(
            (user) => user._id === classTeacher?.userId
          );

          return {
            classId: classItem._id,
            className: classItem.className,
            section: classItem.section,
            teacherName: teacherUser ? teacherUser.fullName : "N/A",
          };
        })
      );
    }
  }, [classes, teachers, users]);

  // Define teacherInfo based on selected user and selected teacher
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
            value: teacherClassDetails
              .map((c) => `${c.className}-${c.section}`)
              .join(", "),
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
        <Card title="Class Teachers">
          <List
            itemLayout="horizontal"
            dataSource={classTeacherList}
            renderItem={(classItem) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleUpdateTeacher(classItem)}
                  >
                    Update
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`${classItem.className} - ${classItem.section}`}
                  description={`Class Teacher: ${classItem.teacherName}`}
                />
              </List.Item>
            )}
          />
          {classTeacherList.length === 0 && (
            <p>No classes assigned to this teacher.</p>
          )}
        </Card>
      ),
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} />
      <Modal
        title="Update Class Teacher"
        open={isModalVisible}
        onCancel={closeModal}
        onOk={handleUpdateSubmit}
      >
        <p>
          Update Class Teacher for {currentClass?.className} -{" "}
          {currentClass?.section}
        </p>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select a teacher"
          optionFilterProp="children"
          onChange={setNewTeacherId} // Set new teacher ID on change
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          value={newTeacherId} // Bind the selected value
        >
          {teachers?.map((teacher) => {
            // Find the corresponding user for each teacher
            const teacherUser = users.find(
              (user) => user._id === teacher.userId
            );
            return (
              <Select.Option key={teacher._id} value={teacher._id}>
                {teacherUser ? teacherUser.fullName : "Unknown Teacher"}
              </Select.Option>
            );
          })}
        </Select>
        {/* Additional content for updating teacher goes here */}
      </Modal>
    </>
  );
};

export default TeacherDetails;
