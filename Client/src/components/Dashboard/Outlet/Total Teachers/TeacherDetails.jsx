import { Tabs, Card, Table, List, Button, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SearchWithSuggestions from "../Total Students/SearchWithSuggestions";
import { updateClassTeacher } from "../../../../Redux/slices/classSlice.js";
import { fetchAllTeachers } from "../../../../Redux/slices/allTeacherSlice.js";

const TeacherDetails = () => {
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
    console.log("selected user", user);
    console.log("teachers", teachers);

    const teacher = teachers?.filter((teacher) => teacher.userId === user._id);
    console.log("teacher", teacher);

    setSelectedTeacher(teacher[0] || null);

    // Get classes assigned to this teacher
    const assignedClasses = classes?.filter(
      (classItem) => classItem.classTeacher === teacher?._id
    );
    setTeacherClassDetails(assignedClasses);

    setSelectedUser(user || null);

    // if(teacher){
    //   const fetchTeacherSalary = async() => {
    //     const response = await axios.get()
    //   }
    // }
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
        dispatch(
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
            value:
              teacherClassDetails &&
              teacherClassDetails
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
    {
      label: "Salary Details",
      key: "3",
      children: (
        <Card title="Salary Payment Status" style={{ marginBottom: 16 }}>
          {salaryData ? (
            <>
              {/* Payment Status */}
              <Card
                style={{
                  marginTop: 8,
                  marginBottom: 16,
                  position: "relative",
                }}
                title="Salary Details"
                extra={
                  <Button type="primary" onClick={showModal}>
                    Pay Now
                  </Button>
                }
              >
                <p>
                  Status:{" "}
                  {salaryData?.employeeSalaryPaymentDetails[0]?.status || "N/A"}
                </p>
                <p>
                  Due Amount: ₹
                  {salaryData?.employeeSalaryPaymentDetails[0]?.overDueAmount ||
                    "N/A"}
                </p>
                <p>
                  Remarks:{" "}
                  {salaryData?.employeeSalaryPaymentDetails[0]?.remarks ||
                    "N/A"}
                </p>
              </Card>

              {/* Modal for Payment */}
              <Modal
                title="Complete Payment"
                open={isModalVisible}
                onOk={closeModal}
                onCancel={closeModal}
                okText="Submit Payment"
              >
                <Form layout="vertical">
                  <Form.Item label="Select Payment Method" required>
                    <Select
                      placeholder="Choose a payment method"
                      onChange={handlePaymentMethodChange}
                    >
                      <Select.Option value="cash">Cash</Select.Option>
                      <Select.Option value="card">
                        Credit/Debit Card
                      </Select.Option>
                      <Select.Option value="upi">UPI</Select.Option>
                      <Select.Option value="bank">Bank Transfer</Select.Option>
                    </Select>
                  </Form.Item>

                  {selectedPaymentMethod === "card" && (
                    <>
                      <Form.Item label="Card Number" required>
                        <Input placeholder="Enter card number" maxLength={16} />
                      </Form.Item>
                      <Form.Item label="Card Holder Name" required>
                        <Input placeholder="Enter name on card" />
                      </Form.Item>
                      <Form.Item label="Expiry Date" required>
                        <Input placeholder="MM/YY" maxLength={5} />
                      </Form.Item>
                      <Form.Item label="CVV" required>
                        <Input.Password placeholder="CVV" maxLength={3} />
                      </Form.Item>
                    </>
                  )}

                  {selectedPaymentMethod === "upi" && (
                    <Form.Item label="UPI ID" required>
                      <Input placeholder="Enter UPI ID (e.g., user@upi)" />
                    </Form.Item>
                  )}

                  {selectedPaymentMethod === "bank" && (
                    <>
                      <Form.Item label="Account Number" required>
                        <Input placeholder="Enter bank account number" />
                      </Form.Item>
                      <Form.Item label="IFSC Code" required>
                        <Input placeholder="Enter IFSC code" />
                      </Form.Item>
                    </>
                  )}

                  {selectedPaymentMethod === "cash" && (
                    <p>
                      Please proceed to the finance office to complete your cash
                      payment.
                    </p>
                  )}
                </Form>
              </Modal>

              {/* Salary Breakdown */}
              <Descriptions title="Salary Breakdown" bordered column={2}>
                <Descriptions.Item label="Base Salary">
                  ₹{salaryData?.employeeSalaryDetails[0]?.baseSalary || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Bonuses">
                  ₹{salaryData?.employeeSalaryDetails[0]?.bonuses || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Deductions">
                  ₹{salaryData?.employeeSalaryDetails[0]?.deductions || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Tax">
                  ₹{salaryData?.employeeSalaryDetails[0]?.tax || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Total Payable Salary">
                  ₹
                  {salaryData?.employeeSalaryPaymentDetails[0]?.amount || "N/A"}
                </Descriptions.Item>
              </Descriptions>

              {/* Payment History Table */}
              <Card title="Payment History" style={{ marginTop: 16 }}>
                <Table
                  dataSource={salaryData?.employeeSalaryPaymentDetails || []}
                  rowKey="_id"
                  pagination={false}
                  columns={[
                    {
                      title: "Transaction ID",
                      dataIndex: "transactionId",
                      key: "transactionId",
                    },
                    {
                      title: "Amount",
                      dataIndex: "amount",
                      key: "amount",
                      render: (amount) => `₹${amount}`,
                    },
                    {
                      title: "Method",
                      dataIndex: "paymentMethod",
                      key: "paymentMethod",
                    },
                    { title: "Status", dataIndex: "status", key: "status" },
                    {
                      title: "Payment Date",
                      dataIndex: "paymentDate",
                      key: "paymentDate",
                      render: (date) => new Date(date).toLocaleDateString(),
                    },
                    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
                  ]}
                />
              </Card>
            </>
          ) : (
            <p>No employee selected.</p>
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
