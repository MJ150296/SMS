import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatisticCard from "./StatisticCard.jsx";
import { useNavigate } from "react-router-dom";
import RoleDistributionChart from "./Charts/RoleDistributionChart.jsx";
import MonthlyRegistrationsChart from "./Charts/MonthlyRegistrationChart.jsx";
import { fetchEvents } from "../../../Redux/slices/eventSlice.js";
import dayjs from "dayjs";

const UserStatistics = () => {
  const { userInfo } = useSelector((state) => state.user);

  const { users, isLoading, error } = useSelector((state) => state.allUsers);

  const [roleCounts, setRoleCounts] = useState({});

  const [studentData, setStudentData] = useState();

  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);

  const dispatch = useDispatch();

  const { events } = useSelector((state) => state.events);

  const [upcomingEvents, setUpcomingEvents] = useState(0);

  const [activeEvents, setActiveEvents] = useState(0);

  useEffect(() => {
    dispatch(fetchEvents());
  }, []);

  useEffect(() => {
    if (users && users.length > 0) {
      if (events) {
        setUpcomingEvents(
          events.filter((event) => dayjs().isBefore(event.startDate))
        );

        setActiveEvents(
          events.filter(
            (event) =>
              dayjs().isAfter(event.startDate) &&
              dayjs().isBefore(event.endDate)
          )
        );
      }
    }
  }, [events]);

  // Counting roles count . eg: superAdmin: 1, admin:3

  useEffect(() => {
    if (users && users.length > 0) {
      // Count roles using reduce
      const counts = users.reduce((acc, user) => {
        const { role } = user;
        if (role) {
          acc[role] = (acc[role] || 0) + 1;
        }
        return acc;
      }, {});
      console.log(counts);

      setRoleCounts(counts);

      setStudentData(users.filter((user) => user.role === "student"));
    }
  }, [users]);

  const getMonthlyData = () => {
    const monthlyData = {
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      studentRegistrations: Array(12).fill(0),
      teacherRegistrations: Array(12).fill(0),
      adminRegistrations: Array(12).fill(0),
    };

    const currentMonth = new Date().getMonth(); // Get current month (0-11)
    let totalCurrentMonth = 0; // Initialize total for current month

    // Loop through each user and count registrations by month
    users.forEach((user) => {
      if (user.createdAt) {
        const createdAtDate = new Date(user.createdAt);
        const month = createdAtDate.getMonth(); // Get month (0-11)

        // Check user role and increment respective count
        if (user.role === "student") {
          monthlyData.studentRegistrations[month] += 1;
          if (month === currentMonth) totalCurrentMonth += 1; // Increment total for current month
        } else if (user.role === "teacher") {
          monthlyData.teacherRegistrations[month] += 1;
          if (month === currentMonth) totalCurrentMonth += 1; // Increment total for current month
        } else if (user.role === "admin") {
          monthlyData.adminRegistrations[month] += 1;
          if (month === currentMonth) totalCurrentMonth += 1; // Increment total for current month
        }
      }
    });

    setCurrentMonthTotal(totalCurrentMonth); // Current month How many users are registered

    return monthlyData;
  };

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (users && users.length > 0) {
      const monthlyData = getMonthlyData(users);
      setMonthlyData(monthlyData); // For monthly registration chart
      console.log(monthlyData);
    }
  }, []);

  const renderStatistics = () => {
    const navigate = useNavigate();

    switch (userInfo?.role) {
      case "superAdmin":
        return (
          <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-4 p-4">
              {/* SuperAdmin statistics */}
              <div
                onClick={() => {
                  navigate("/dashboard/student_details");
                }}
                className="cursor-pointer"
              >
                <StatisticCard
                  title="Total Students"
                  value={roleCounts.student}
                />
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/teacher_details");
                }}
                className="cursor-pointer"
              >
                <StatisticCard
                  title="Total Teachers"
                  value={roleCounts.teacher}
                />
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/admin_details");
                }}
                className="cursor-pointer"
              >
                <StatisticCard title="Admin Members" value={roleCounts.admin} />
              </div>
              <StatisticCard title="Pending Approvals" value="23" />
              <StatisticCard title="Overall Attendance" value="94%" />
              <StatisticCard
                title="Events"
                value={`${activeEvents?.length || "0"} Ongoing/ ${
                  upcomingEvents?.length || "0"
                } Upcoming`}
              />
              <StatisticCard title="Fees/Revenue" value="$500K Collected" />
              <StatisticCard
                title="New Registrations"
                value={currentMonthTotal}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 p-5">
              <MonthlyRegistrationsChart monthlyData={monthlyData} />
              <RoleDistributionChart roleCounts={roleCounts} />
            </div>
          </div>
        );

      case "admin":
        return (
          <div className="grid grid-cols-4 gap-4 p-4">
            {/* Admin statistics */}
            <StatisticCard title="Total Students" value="850" />
            <StatisticCard title="Total Teachers" value="50" />
            <StatisticCard title="Attendance Overview" value="96%" />
            <StatisticCard title="Pending Student Approvals" value="10" />
            <StatisticCard title="Pending Teacher Approvals" value="5" />
            <StatisticCard title="Disciplinary Reports" value="3" />
            <StatisticCard title="Fees Collection" value="$200K Outstanding" />
            <StatisticCard title="Upcoming School Events" value="2" />
          </div>
        );

      case "teacher":
        return (
          <div className="grid grid-cols-4 gap-4 p-4">
            {/* Teacher statistics */}
            <StatisticCard title="Assigned Students" value="120" />
            <StatisticCard title="Class Performance" value="B+" />
            <StatisticCard title="Pending Grading" value="15 Assignments" />
            <StatisticCard title="Class Attendance" value="95%" />
            <StatisticCard title="Assignments/Exams" value="5 Due" />
            <StatisticCard title="Student Progress Reports" value="Available" />
            <StatisticCard title="Behavioral Reports" value="1 Filed" />
            <StatisticCard title="Syllabus Coverage" value="80% Complete" />
          </div>
        );

      case "student":
        return (
          <div className="grid grid-cols-4 gap-4 p-4">
            {/* Student statistics */}
            <StatisticCard title="My Grades" value="85%" />
            <StatisticCard title="Attendance" value="96%" />
            <StatisticCard title="Upcoming Assignments" value="2 Pending" />
            <StatisticCard title="Disciplinary Actions" value="None" />
            <StatisticCard title="Class Ranking" value="Top 10%" />
            <StatisticCard title="Tasks" value="8 Completed / 2 Pending" />
            <StatisticCard
              title="Extracurricular Activities"
              value="3 Participated"
            />
            <StatisticCard title="Library Usage" value="4 Books Issued" />
          </div>
        );

      default:
        return null; // In case role is not identified
    }
  };

  return <div>{renderStatistics()}</div>;
};

export default UserStatistics;
