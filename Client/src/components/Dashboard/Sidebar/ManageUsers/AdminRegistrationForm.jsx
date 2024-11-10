import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Space,
  Checkbox,
} from "antd";
import React from "react";

const AdminRegistrationForm = ({ setFormData }) => {
  const [form] = Form.useForm();

  const onValuesChange = (changedValues, allValues) => {
    setFormData({
      ...allValues,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={onValuesChange}
      style={{ maxWidth: "800px", margin: "0 10px", padding: "20px" }}
      initialValues={{
        employmentType: "Permanent", // Default employment type
        accessLevel: "Standard", // Default access level
        allowances: {
          houseAllowance: false,
          transportationAllowance: false,
          specialAllowance: false,
          otherAllowances: { description: "", amount: 0 },
        },
        deductions: {
          taxDeduction: false,
          providentFund: false,
          professionalTax: false,
          otherDeductions: { description: "", amount: 0 },
        },
        bonuses: {
          performanceBonus: false,
          festivalBonus: false,
          otherBonuses: { description: "", amount: 0 },
        },
        address: {
          country: "India",
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

      {/* Department */}
      <Form.Item
        label="Department"
        name="department"
        rules={[{ required: true, message: "Please select a department" }]}
      >
        <Select placeholder="Select Department">
          <Select.Option value="Admin Office">Admin Office</Select.Option>
          <Select.Option value="Operations and Facilities">
            Operations and Facilities
          </Select.Option>
          <Select.Option value="IT and Technology">
            IT and Technology
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Academic Year"
        name="academicYear"
        rules={[{ required: true, message: "Academic Year is required" }]}
      >
        <Select>
          <Select.Option value="2024-2025">2024-2025</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="mobileNumber"
        rules={[
          { required: true, message: "Mobile number is required" },
          { pattern: /^\d{10}$/, message: "Mobile number must be 10 digits" },
        ]}
      >
        <Input placeholder="Mobile Number" />
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dob"
        rules={[{ required: true, message: "Please select Date of Birth" }]}
      >
        <DatePicker
          placeholder="Select Date of Birth"
          format="YYYY-MM-DD"
          style={{ width: "100%" }}
        />
      </Form.Item>

      {/* Employment Type */}
      <Form.Item
        label="Employment Type"
        name="employmentType"
        rules={[{ required: true, message: "Employment Type is required" }]}
      >
        <Select>
          <Select.Option value="Permanent">Permanent</Select.Option>
          <Select.Option value="Contract">Contract</Select.Option>
        </Select>
      </Form.Item>

      {/* Access Level */}
      <Form.Item
        label="Access Level"
        name="accessLevel"
        rules={[{ required: true, message: "Access Level is required" }]}
      >
        <Select>
          <Select.Option value="Standard">Standard</Select.Option>
          <Select.Option value="Managerial">Managerial</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Address" style={{ marginBottom: 0 }}>
        <Space wrap>
          <Form.Item
            name={["address", "street"]}
            rules={[{ required: true, message: "Street is required" }]}
          >
            <Input placeholder="Street" />
          </Form.Item>
          <Form.Item
            name={["address", "city"]}
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="City" />
          </Form.Item>
          <Form.Item
            name={["address", "state"]}
            rules={[{ required: true, message: "State is required" }]}
          >
            <Input placeholder="State" />
          </Form.Item>
          <Form.Item
            name={["address", "postalCode"]}
            rules={[{ required: true, message: "Postal Code is required" }]}
          >
            <Input placeholder="Postal Code" />
          </Form.Item>
          <Form.Item name={["address", "country"]}>
            <Input placeholder="India" disabled />
          </Form.Item>
        </Space>
      </Form.Item>

      {/* Allowances */}
      <Form.Item label="Allowances">
        <Form.Item
          name={["allowances", "houseAllowance"]}
          valuePropName="checked"
        >
          <Checkbox>House Allowance</Checkbox>
        </Form.Item>
        <Form.Item
          name={["allowances", "transportationAllowance"]}
          valuePropName="checked"
        >
          <Checkbox>Transportation Allowance</Checkbox>
        </Form.Item>
        <Form.Item
          name={["allowances", "specialAllowance"]}
          valuePropName="checked"
        >
          <Checkbox>Special Allowance</Checkbox>
        </Form.Item>
        {/* Other Allowance Description and Amount */}
        <Form.Item
          label="Other Allowance Description"
          name={["allowances", "otherAllowances", "description"]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label="Other Allowance Amount"
          name={["allowances", "otherAllowances", "amount"]}
          rules={[
            { type: "number", min: 0, message: "Amount cannot be negative" },
          ]}
        >
          <InputNumber placeholder="Enter amount" min={0} />
        </Form.Item>
      </Form.Item>

      {/* Deductions */}
      <Form.Item label="Deductions">
        <Form.Item
          name={["deductions", "taxDeduction"]}
          valuePropName="checked"
        >
          <Checkbox>Tax Deduction</Checkbox>
        </Form.Item>
        <Form.Item
          name={["deductions", "providentFund"]}
          valuePropName="checked"
        >
          <Checkbox>Provident Fund Deduction</Checkbox>
        </Form.Item>
        <Form.Item
          name={["deductions", "professionalTax"]}
          valuePropName="checked"
        >
          <Checkbox>Professional Tax Deduction</Checkbox>
        </Form.Item>
        {/* Other Deduction Description and Amount */}
        <Form.Item
          label="Other Deduction Description"
          name={["deductions", "otherDeductions", "description"]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label="Other Deduction Amount"
          name={["deductions", "otherDeductions", "amount"]}
          rules={[
            { type: "number", min: 0, message: "Amount cannot be negative" },
          ]}
        >
          <InputNumber placeholder="Enter amount" min={0} />
        </Form.Item>
      </Form.Item>

      {/* Bonuses */}
      <Form.Item label="Bonuses">
        <Form.Item
          name={["bonuses", "performanceBonus"]}
          valuePropName="checked"
        >
          <Checkbox>Performance Bonus</Checkbox>
        </Form.Item>
        <Form.Item name={["bonuses", "festivalBonus"]} valuePropName="checked">
          <Checkbox>Festival Bonus</Checkbox>
        </Form.Item>
        {/* Other Bonus Description and Amount */}
        <Form.Item
          label="Other Bonus Description"
          name={["bonuses", "otherBonuses", "description"]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label="Other Bonus Amount"
          name={["bonuses", "otherBonuses", "amount"]}
          rules={[
            { type: "number", min: 0, message: "Amount cannot be negative" },
          ]}
        >
          <InputNumber placeholder="Enter amount" min={0} />
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

export default AdminRegistrationForm;
