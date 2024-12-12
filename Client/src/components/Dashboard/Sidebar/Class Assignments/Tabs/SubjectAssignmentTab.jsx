import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

const SubjectAssignmentTab = () => {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form] = Form.useForm();

  // Hardcoded subjects for different class ranges
  const subjectsByClass = {
    "1-5": ["Math", "Science", "English", "Art", "Physical Education"],
    "5-10": [
      "Math",
      "Science",
      "English",
      "History",
      "Geography",
      "Civics",
      "Physical Education",
    ],
    "11-12": [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Computer Science",
      "Economics",
      "History",
    ],
  };

  const [availableSubjects, setAvailableSubjects] = useState([]);

  // Handle class change to update available subjects
  const handleClassChange = (value) => {
    const subjects = subjectsByClass[value] || [];
    setAvailableSubjects(subjects);
    form.setFieldsValue({ subject: [] }); // Clear selected subjects
  };

  const columns = [
    { title: "Class", dataIndex: "class", key: "class" },
    {
      title: "Subjects",
      dataIndex: "subject",
      key: "subjects",
      render: (subject) => {
        if (!subject || !Array.isArray(subject)) {
          return "No subjects assigned"; // Handle undefined or invalid data
        }
        return subject.join(", ");
      },
    },
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
    console.log("Values", values);

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
    console.log("assignments", newAssignment);

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

  // useEffect(() => {
  //   console.log(assignments);
  // }, [assignments]);

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Assignment
      </Button>
      <Table dataSource={assignments} columns={columns} className="mt-4" />
      <Modal
        title={editingAssignment ? "Edit Assignment" : "Add Assignment"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={addAssignment}>
          <Form.Item name="class" label="Class" rules={[{ required: true }]}>
            <Select onChange={handleClassChange}>
              <Select.Option value="1-5">Class 1-5 (Primary)</Select.Option>
              <Select.Option value="5-10">
                Class 5-10 (Middle Secondary)
              </Select.Option>
              <Select.Option value="11-12">
                Class 11-12 (Secondary)
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subjects"
            rules={[
              { required: true, message: "Please select at least one subject" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select subjects"
              disabled={!availableSubjects.length}
            >
              {availableSubjects.map((subject) => (
                <Select.Option key={subject} value={subject}>
                  {subject}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectAssignmentTab;
