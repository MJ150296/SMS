import React from "react";
import { Tabs, Typography } from "antd";
import ClassScheduleTab from "./Tabs/ClassScheduleTab";
import SubjectAssignmentTab from "./Tabs/SubjectAssignmentTab";
import TeacherAssignmentTab from "./Tabs/TeacherAssignmentTab";

const { Title } = Typography;

const ClassScheduleAndAssignments = () => {
  const tabItems = [
    {
      key: "1",
      label: "Subject Assignment",
      children: (
        <div>
          <Title level={4}>Assign Subjects to Classes</Title>
          <p>Allocate subjects to respective classes in the system.</p>
          {/* Insert your subject assignment component or logic here */}
          <SubjectAssignmentTab />
        </div>
      ),
    },
    {
      key: "2",
      label: "Class Schedule",
      children: (
        <div>
          <Title level={4}>Daily Class Schedule</Title>
          <p>Organize and display the daily timetable for all classes.</p>
          {/* Insert your class schedule component or logic here */}
          <ClassScheduleTab />
        </div>
      ),
    },
    {
      key: "3",
      label: "Teacher Assignment",
      children: (
        <div>
          <Title level={4}>Assign Teachers to Classes</Title>
          <p>
            Assign teachers to classes based on their subject specialization.
          </p>
          {/* Insert your teacher assignment component or logic here */}
          <TeacherAssignmentTab />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <Title level={3}>Class Schedule & Assignments</Title>
      <Tabs items={tabItems} />
    </div>
  );
};

export default ClassScheduleAndAssignments;
