import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Checkbox, Radio, Space } from "antd";
import dayjs from "dayjs";

const StudentRegistrationForm = ({ setFormData }) => {
  const [form] = Form.useForm();
  const [isTransportation, setIsTransportation] = useState(false);
  const [isHostelRequired, setIsHostelRequired] = useState(false);

  const onValuesChange = (changedValues, allValues) => {
    setFormData({
      ...allValues,
      transportation: isTransportation ? allValues.transportation : undefined,
      hostel: isHostelRequired ? allValues.hostel : undefined,
      guardianDetails: {
        ...allValues.guardianDetails,
        address: allValues.guardianDetails?.address,
      },
      concessions: {
        ...allValues.concessions,
      },
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={onValuesChange}
      style={{ maxWidth: "800px", margin: "0 10px", padding: "20px" }}
      initialValues={{
        dob: dayjs(),
        section: "A",
        academicYear: "2024-2025",
        guardianDetails: {
          fatherName: "Mayank Joshi",
          motherName: "Mayank Joshi",
          contactNumber: "07895927366",
          address: {
            street: "abc",
            city: "xyz",
            state: "jkl",
            postalCode: "201009",
            country: "India",
          },
        },
      }}
    >
      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: "Please enter the full name" }]}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please enter a valid email",
          },
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter the password" }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dob"
        rules={[{ required: true, message: "Please select Date of Birth" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Class Enrolled"
        name="classEnrolled"
        rules={[{ required: true, message: "Class is required" }]}
      >
        <Input placeholder="Enter class enrolled" />
      </Form.Item>

      <Form.Item
        label="Section"
        name="section"
        rules={[{ required: true, message: "Please select Section" }]}
      >
        <Select>
          <Select.Option value="A">A</Select.Option>
          <Select.Option value="B">B</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Academic Year"
        name="academicYear"
        rules={[{ required: true, message: "Please enter the Academic Year" }]}
      >
        <Select>
          <Select.Option value="2024-2025">2024-2025</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Father's Name"
        name={["guardianDetails", "fatherName"]}
        rules={[{ required: true, message: "Father's Name is required" }]}
      >
        <Input placeholder="Enter Father's Name" />
      </Form.Item>

      <Form.Item
        label="Mother's Name"
        name={["guardianDetails", "motherName"]}
        rules={[{ required: true, message: "Mother's Name is required" }]}
      >
        <Input placeholder="Enter Mother's Name" />
      </Form.Item>

      <Form.Item
        label="Guardian's Contact Number"
        name={["guardianDetails", "contactNumber"]}
        rules={[
          {
            required: true,
            pattern: /^\d{10,15}$/,
            message: "Please provide a valid contact number",
          },
        ]}
      >
        <Input placeholder="Enter Contact Number" />
      </Form.Item>

      <Form.Item label="Address" style={{ marginBottom: 0 }}>
        <Space wrap>
          <Form.Item
            name={["guardianDetails", "address", "street"]}
            rules={[{ required: true, message: "Street is required" }]}
          >
            <Input placeholder="Street" />
          </Form.Item>
          <Form.Item
            name={["guardianDetails", "address", "city"]}
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="City" />
          </Form.Item>
          <Form.Item
            name={["guardianDetails", "address", "state"]}
            rules={[{ required: true, message: "State is required" }]}
          >
            <Input placeholder="State" />
          </Form.Item>
          <Form.Item
            name={["guardianDetails", "address", "postalCode"]}
            rules={[{ required: true, message: "Postal Code is required" }]}
          >
            <Input placeholder="Postal Code" />
          </Form.Item>
          <Form.Item name={["guardianDetails", "address", "country"]}>
            <Input disabled />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item name="transportation" valuePropName="checked">
        <Checkbox onChange={(e) => setIsTransportation(e.target.checked)}>
          Transportation Required
        </Checkbox>
      </Form.Item>

      {isTransportation && (
        <>
          <Form.Item
            label="Distance"
            name={["transportation", "distance"]}
            rules={[{ required: true, message: "Please select a distance" }]}
          >
            <Select placeholder="Select Distance">
              <Select.Option value="upto 10km">Upto 10km</Select.Option>
              <Select.Option value="10-20km">10-20km</Select.Option>
              <Select.Option value="above 20km">Above 20km</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trip Type"
            name={["transportation", "tripType"]}
            rules={[{ required: true, message: "Please select a trip type" }]}
          >
            <Radio.Group>
              <Radio value="oneWay">One-Way Trip</Radio>
              <Radio value="roundTrip">Round Trip</Radio>
            </Radio.Group>
          </Form.Item>
        </>
      )}

      <Form.Item name="hostel" valuePropName="checked">
        <Checkbox onChange={(e) => setIsHostelRequired(e.target.checked)}>
          Hostel Required
        </Checkbox>
      </Form.Item>

      {isHostelRequired && (
        <>
          <Form.Item
            label="Room Type"
            name={["hostel", "roomType"]}
            rules={[{ required: true, message: "Please select a room type" }]}
          >
            <Select placeholder="Select Room Type">
              <Select.Option value="single">Single</Select.Option>
              <Select.Option value="double">Double</Select.Option>
              <Select.Option value="dormitory">Dormitory</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Boarding Option"
            name={["hostel", "boardingOption"]}
            rules={[
              { required: true, message: "Please select a boarding option" },
            ]}
          >
            <Select placeholder="Select Boarding Option">
              <Select.Option value="fullTime">Full Time</Select.Option>
              <Select.Option value="weekDays">Week Days</Select.Option>
              <Select.Option value="weekEnds">Week Ends</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Meal Plan"
            name={["hostel", "mealPlan"]}
            rules={[{ required: true, message: "Please select a meal plan" }]}
          >
            <Select placeholder="Select Meal Plan">
              <Select.Option value="standard">Standard</Select.Option>
              <Select.Option value="premium">Premium</Select.Option>
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item label="Concessions">
        <Form.Item
          name={["concessions", "siblingDiscount"]}
          valuePropName="checked"
          noStyle
        >
          <Checkbox>Sibling Discount</Checkbox>
        </Form.Item>
        <Form.Item
          name={["concessions", "incomeBasedDiscount"]}
          valuePropName="checked"
          noStyle
        >
          <Checkbox>Income-Based Discount</Checkbox>
        </Form.Item>
        <Form.Item
          name={["concessions", "meritScholarship"]}
          valuePropName="checked"
          noStyle
        >
          <Checkbox>Merit Scholarship</Checkbox>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

export default StudentRegistrationForm;
