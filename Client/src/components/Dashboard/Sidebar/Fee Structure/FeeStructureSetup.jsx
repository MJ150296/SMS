import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Select,
  InputNumber,
  Button,
  Form,
  Typography,
  Checkbox,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { createFeeStructure } from "../../../../Redux/slices/feeStructureSlice.js";
import TeacherSalaryStructureForm from "./TeacherSalaryStructureForm.jsx";
import AdminSalaryStructureForm from "./AdminSalaryStructure.jsx";

const { Option } = Select;
const { Title } = Typography;

const FeeStructureSetup = () => {
  const { control, handleSubmit, watch, setValue } = useForm();
  const [isHostelRequired, setIsHostelRequired] = useState(false);
  const [isTransportRequired, setIsTransportRequired] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    console.log("Fee Structure Data:", data);
    dispatch(createFeeStructure(data));
  };

  const currentYear = dayjs().year();
  const nextYear = currentYear + 1;

  const tabItems = [
    {
      key: "1",
      label: "Student Fee Structure",
      children: (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Academic Year" name="academicYear">
            <Controller
              name="academicYear"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={`${currentYear}-${nextYear
                    .toString()
                    .slice(-2)}`}
                  className="border-gray-300 rounded-md"
                >
                  <Option
                    value={`${currentYear}-${nextYear.toString().slice(-2)}`}
                  >
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

          <Form.Item label="Base Tuition Fee">
            <Controller
              name="baseTuitionFee"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  placeholder="Enter base tuition fee"
                  className="border-gray-300 rounded-md w-full"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={isHostelRequired}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsHostelRequired(checked);
                if (!checked) {
                  setValue("roomType", undefined);
                  setValue("boardingOption", undefined);
                  setValue("mealPlan", undefined);
                  setValue("hostelFeeAmount", undefined);
                }
              }}
            >
              Hostel Required
            </Checkbox>
          </Form.Item>

          {isHostelRequired && (
            <Form.Item label="Hostel Fee">
              <div className="mb-4">
                <Controller
                  name="roomType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Room Type"
                      className="border-gray-300 rounded-md"
                    >
                      <Option value="Single">Single</Option>
                      <Option value="Double">Double</Option>
                      <Option value="Dormitory">Dormitory</Option>
                    </Select>
                  )}
                />
              </div>

              <div className="mb-4">
                <Controller
                  name="boardingOption"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Boarding Option"
                      className="border-gray-300 rounded-md"
                    >
                      <Option value="Full-time">Full-time</Option>
                      <Option value="Weekday">Weekday</Option>
                      <Option value="Weekend">Weekend</Option>
                    </Select>
                  )}
                />
              </div>

              <div className="mb-4">
                <Controller
                  name="mealPlan"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Meal Plan"
                      className="border-gray-300 rounded-md"
                    >
                      <Option value="Standard">Standard</Option>
                      <Option value="Premium">Premium</Option>
                    </Select>
                  )}
                />
              </div>

              <div className="mb-4">
                <Controller
                  name="hostelFeeAmount"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0}
                      placeholder="Hostel Fee Amount"
                      className="border-gray-300 rounded-md w-full"
                    />
                  )}
                />
              </div>
            </Form.Item>
          )}

          <Form.Item>
            <Checkbox
              checked={isTransportRequired}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsTransportRequired(checked);
                if (!checked) {
                  setValue("distanceZone", undefined);
                  setValue("oneWayFee", undefined);
                  setValue("roundTripFee", undefined);
                }
              }}
            >
              Transportation Required
            </Checkbox>
          </Form.Item>

          {isTransportRequired && (
            <Form.Item label="Transportation Fee">
              <div className="mb-4">
                <Controller
                  name="distanceZone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Distance Zone (e.g., within 5 km)"
                      {...field}
                      className="border-gray-300 rounded-md"
                    />
                  )}
                />
              </div>

              <div className="mb-4">
                <Controller
                  name="oneWayFee"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0}
                      placeholder="One Way Fee"
                      className="border-gray-300 rounded-md w-full"
                    />
                  )}
                />
              </div>

              <div className="mb-4">
                <Controller
                  name="roundTripFee"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0}
                      placeholder="Round Trip Fee"
                      className="border-gray-300 rounded-md w-full"
                    />
                  )}
                />
              </div>
            </Form.Item>
          )}

          {[
            "libraryFee",
            "examFees",
            "uniformFee",
            "labFees",
            "extracurricularFees",
            "digitalResourcesFee",
            "sportsFacilityFee",
            "medicalServiceFee",
            "counselingFee",
          ].map((feeType) => (
            <Form.Item
              key={feeType}
              label={feeType
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            >
              <Controller
                name={feeType}
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    placeholder={`Enter ${feeType}`}
                    className="border-gray-300 rounded-md w-full"
                  />
                )}
              />
            </Form.Item>
          ))}

          <Form.Item label="Concessions">
            <div className="mb-4">
              <Controller
                name="siblingDiscount"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    placeholder="Sibling Discount (%)"
                    className="border-gray-300 rounded-md w-full"
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="incomeBasedDiscount"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    placeholder="Income-Based Discount (%)"
                    className="border-gray-300 rounded-md w-full"
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="meritScholarship"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    placeholder="Merit Scholarship (%)"
                    className="border-gray-300 rounded-md w-full"
                  />
                )}
              />
            </div>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
          >
            Save Fee Structure
          </Button>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Teacher Salary Structure",
      children: <TeacherSalaryStructureForm />,
    },
    {
      key: "3",
      label: "Admin Salary Structure",
      children: <AdminSalaryStructureForm />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Title level={3} className="text-center">
        Fee Structure Setup
      </Title>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default FeeStructureSetup;
