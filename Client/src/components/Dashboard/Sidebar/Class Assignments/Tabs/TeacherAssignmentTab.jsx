import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

const TeacherAssignmentTab = () => {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    { title: "Class", dataIndex: "class", key: "class" },
    { title: "Teacher", dataIndex: "teacher", key: "teacher" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => editAssignment(record)}>Edit</Button>
          <Button danger onClick={() => deleteAssignment(record.key)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const addAssignment = (values) => {
    const newAssignment = {
      key: editingAssignment ? editingAssignment.key : Date.now(),
      ...values,
    };

    if (editingAssignment) {
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.key === editingAssignment.key ? newAssignment : assignment
        )
      );
      message.success("Assignment updated successfully!");
    } else {
      setAssignments((prev) => [...prev, newAssignment]);
      message.success("Assignment added successfully!");
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const deleteAssignment = (key) => {
    setAssignments((prev) =>
      prev.filter((assignment) => assignment.key !== key)
    );
    message.success("Assignment deleted successfully!");
  };

  const editAssignment = (record) => {
    setEditingAssignment(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Assignment
      </Button>
      <Table dataSource={assignments} columns={columns} className="mt-4" />
      <Modal
        title={editingAssignment ? "Edit Assignment" : "Add Assignment"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={addAssignment}>
          <Form.Item
            name="class"
            label="Class"
            rules={[{ required: true, message: "Please select a class!" }]}
          >
            <Select placeholder="Select Class">
              <Select.Option value="Class A">Class A</Select.Option>
              <Select.Option value="Class B">Class B</Select.Option>
              <Select.Option value="Class C">Class C</Select.Option>
              {/* Add more class options dynamically */}
            </Select>
          </Form.Item>

          <Form.Item
            name="teacher"
            label="Teacher"
            rules={[{ required: true, message: "Please select a teacher!" }]}
          >
            <Select placeholder="Select Teacher">
              <Select.Option value="Teacher 1">Teacher 1</Select.Option>
              <Select.Option value="Teacher 2">Teacher 2</Select.Option>
              <Select.Option value="Teacher 3">Teacher 3</Select.Option>
              {/* Add more teacher options dynamically */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherAssignmentTab;
