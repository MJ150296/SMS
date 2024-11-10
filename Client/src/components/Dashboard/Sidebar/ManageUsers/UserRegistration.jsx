import React, { useState } from "react";
import { Tabs, Button, message } from "antd";
import AdminRegistrationForm from "./AdminRegistrationForm";
import TeacherRegistrationForm from "./TeacherRegistrationForm";
import StudentRegistrationForm from "./StudentRegistrationForm";
import axios from "axios";

const UserRegistration = () => {
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  const [formData, setFormData] = useState({}); // Store form data for submission

  // Clear form data when switching tabs
  const handleTabChange = (key) => {
    setActiveTab(key);
    setFormData({}); // Reset form data to ensure only relevant data is populated
  };

  const handleSubmit = async () => {
    if (activeTab === "1") {
      console.log("Admin Data:", formData);
      try {
        const response = await axios.post("/api/v1/register/admin", formData);
      } catch (error) {
        console.log("error in handlesubmit admin register", error);
        return;
      }
      // Submit admin data
    } else if (activeTab === "2") {
      console.log("Teacher Data:", formData);
      try {
        const response = await axios.post("/api/v1/register/teacher", formData);
        console.log(response?.data);
      } catch (error) {
        console.log("error in handlesubmit teacher register", error);
        return;
      }
      // Submit teacher data
    } else if (activeTab === "3") {
      console.log("Student Data:", formData);
      // Submit student data
      try {
        const response = await axios.post("/api/v1/register/student", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          academicYear: formData.academicYear,
          classEnrolled: formData.classEnrolled,
          section: formData.section,
          dateOfBirth: formData.dob, // format if needed (e.g., .toISOString())
          guardianDetails: {
            fatherName: formData.guardianDetails.fatherName,
            motherName: formData.guardianDetails.motherName,
            contactNumber: formData.guardianDetails.contactNumber,
            address: {
              street: formData.guardianDetails.address.street,
              city: formData.guardianDetails.address.city,
              state: formData.guardianDetails.address.state,
              postalCode: formData.guardianDetails.address.postalCode,
            },
          },
          hostel: {
            isHostel: Boolean(formData.hostel),
            hostelDetails: formData.hostel
              ? {
                  roomType: formData.hostel.roomType,
                  boardingOption: formData.hostel.boardingOption,
                  mealPlan: formData.hostel.mealPlan,
                }
              : null,
          },
          transportation: {
            isTransportation: Boolean(formData.transportation),
            transportationDetails: formData.transportation
              ? {
                  distance: formData.transportation.distance,
                  tripType: formData.transportation.tripType,
                }
              : null,
          },
          concessions: {
            siblingDiscount: Boolean(formData.concessions?.siblingDiscount),
            incomeBasedDiscount: Boolean(
              formData.concessions?.incomeBasedDiscount
            ),
            meritScholarship: Boolean(formData.concessions?.meritScholarship),
          },
        });
        console.log("Response:", response);
      } catch (error) {
        console.log("Error in handlesubmit student register", error);
        return;
      }
    }

    message.success("Registration successful!");
    setFormData({}); // Clear form data after submission
  };

  const tabsItems = [
    {
      label: "Admin Registration",
      key: "1",
      children: <AdminRegistrationForm setFormData={setFormData} />,
    },
    {
      label: "Teacher Registration",
      key: "2",
      children: <TeacherRegistrationForm setFormData={setFormData} />,
    },
    {
      label: "Student Registration",
      key: "3",
      children: <StudentRegistrationForm setFormData={setFormData} />,
    },
  ];

  return (
    <>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabsItems}
      />
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
};

export default UserRegistration;
