import React from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { createTeacherSalaryStructure } from "../../../../Redux/slices/teacherSalarySlice.js";

const { Option } = Select;

const TeacherSalaryStructureForm = () => {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const onTeacherSalarySubmit = (data) => {
    console.log("Teacher Salary Structure Submitted:", data);
    dispatch(createTeacherSalaryStructure(data));
  };

  const currentYear = dayjs().year();
  const nextYear = currentYear + 1;

  return (
    <Form layout="vertical" onFinish={handleSubmit(onTeacherSalarySubmit)}>
      {/* Academic Year */}
      <Form.Item label="Academic Year" name="academicYear">
        <Controller
          name="academicYear"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder={`${currentYear}-${nextYear.toString().slice(-2)}`}
              className="border-gray-300 rounded-md"
            >
              <Option value={`${currentYear}-${nextYear.toString().slice(-2)}`}>
                {`${currentYear}-${nextYear.toString().slice(-2)}`}
              </Option>
              <Option
                value={`${nextYear}-${(nextYear + 1).toString().slice(-2)}`}
              >
                {`${nextYear}-${(nextYear + 1).toString().slice(-2)}`}
              </Option>
            </Select>
          )}
        />
      </Form.Item>

      {/* Base Salary */}
      <Form.Item label="Base Salary" name="baseSalary">
        <Controller
          name="baseSalary"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Base Salary"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      {/* Allowances */}
      <h3>Allowances</h3>
      <Form.Item label="House Allowance" name="houseAllowance">
        <Controller
          name="allowances.houseAllowance"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter House Allowance"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Transportation Allowance"
        name="transportationAllowance"
      >
        <Controller
          name="allowances.transportationAllowance"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Transportation Allowance"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Medical Allowance" name="medicalAllowance">
        <Controller
          name="allowances.medicalAllowance"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Medical Allowance"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Special Allowance" name="specialAllowance">
        <Controller
          name="allowances.specialAllowance"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Special Allowance"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Other Allowances Description"
        name="otherAllowancesDescription"
      >
        <Controller
          name="allowances.otherAllowances.description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter Description for Other Allowances"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Other Allowances Amount" name="otherAllowancesAmount">
        <Controller
          name="allowances.otherAllowances.amount"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Amount for Other Allowances"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      {/* Deductions */}
      <h3>Deductions</h3>
      <Form.Item label="Tax Deduction" name="taxDeduction">
        <Controller
          name="deductions.taxDeduction"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Tax Deduction"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Provident Fund" name="providentFund">
        <Controller
          name="deductions.providentFund"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Provident Fund"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Professional Tax" name="professionalTax">
        <Controller
          name="deductions.professionalTax"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Professional Tax"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Other Deductions Description"
        name="otherDeductionsDescription"
      >
        <Controller
          name="deductions.otherDeductions.description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter Description for Other Deductions"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Other Deductions Amount" name="otherDeductionsAmount">
        <Controller
          name="deductions.otherDeductions.amount"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Amount for Other Deductions"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      {/* Bonus */}
      <h3>Bonus</h3>
      <Form.Item label="Performance Bonus" name="performanceBonus">
        <Controller
          name="bonus.performanceBonus"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Performance Bonus"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Festival Bonus" name="festivalBonus">
        <Controller
          name="bonus.festivalBonus"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Festival Bonus"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Other Bonuses Description"
        name="otherBonusesDescription"
      >
        <Controller
          name="bonus.otherBonuses.description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter Description for Other Bonuses"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Other Bonuses Amount" name="otherBonusesAmount">
        <Controller
          name="bonus.otherBonuses.amount"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              placeholder="Enter Amount for Other Bonuses"
              className="w-full"
            />
          )}
        />
      </Form.Item>

      {/* Revision Cycle */}
      <Form.Item label="Revision Cycle" name="revisionCycle">
        <Controller
          name="revisionCycle"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Select Revision Cycle"
              className="w-full"
            >
              <Option value="Annual">Annual</Option>
              <Option value="Bi-annual">Bi-annual</Option>
              <Option value="Quarterly">Quarterly</Option>
            </Select>
          )}
        />
      </Form.Item>

      {/* Submit Button */}
      <Button type="primary" htmlType="submit" className="w-full">
        Save Salary Structure
      </Button>
    </Form>
  );
};

export default TeacherSalaryStructureForm;
