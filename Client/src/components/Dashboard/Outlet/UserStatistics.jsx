import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatisticCard from "./StatisticCard.jsx";
import { useNavigate } from "react-router-dom";
import RoleDistributionChart from "./Charts/RoleDistributionChart.jsx";
import MonthlyRegistrationsChart from "./Charts/MonthlyRegistrationChart.jsx";
import { fetchEvents } from "../../../Redux/slices/eventSlice.js";
import dayjs from "dayjs";
import { fetchAllUsers } from "../../../Redux/slices/allUsersSlice.js";
import { fetchAttendanceSummary } from "../../../Redux/slices/allAttendanceSlice.js";

const UserStatistics = () => {
  const { userInfo } = useSelector((state) => state.user);

  const { users } = useSelector((state) => state.allUsers);

  const { summary, summaryLoading, summaryError } = useSelector(
    (state) => state.attendance
  );

  const [roleCounts, setRoleCounts] = useState({});

  const [studentData, setStudentData] = useState();

  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);

  const dispatch = useDispatch();

  const { events } = useSelector((state) => state.events);

  const [upcomingEvents, setUpcomingEvents] = useState(0);

  const [activeEvents, setActiveEvents] = useState(0);

  const [overallAttendance, setOverallAttendance] = useState(0);

  const [studentAttendancePercentage, setStudentAttendancePercentage] =
    useState(0);

  const [teacherAttendancePercentage, setTeacherAttendancePercentage] =
    useState(0);

  const [adminAttendancePercentage, setAdminAttendancePercentage] = useState(0);

  const attendanceCardRef = useRef(null);

  const [isHoverCardVisible, setIsHoverCardVisible] = useState(false);
  const [hoverCardPosition, setHoverCardPosition] = useState({
    top: 0,
    left: 0,
  });

  const [currentMonth, setCurrentMonth] = useState(dayjs().format("MMM"));

  const handleMouseEnter = (event) => {
    setIsHoverCardVisible(true);
    const rect = attendanceCardRef.current.getBoundingClientRect();
    setHoverCardPosition({
      top: rect.bottom + window.scrollY + 10, // Adjust for spacing
      left: rect.left + window.scrollX,
    });
  };

  const handleMouseLeave = () => {
    setIsHoverCardVisible(false);
  };

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAllUsers());
    dispatch(fetchAttendanceSummary());
  }, []);

  useEffect(() => {
    if (summary) {
      console.log("summary", summary);

      const overallAttendancePercentage =
        summary.total > 0 ? (summary.totalPresent / summary.total) * 100 : 0;

      setOverallAttendance(overallAttendancePercentage.toFixed(2));

      const studentAttendancePercentage =
        (summary.student.present /
          (summary.student.present +
            summary.student.absent +
            summary.student.late +
            summary.student.approved_leave)) *
        100;
      setStudentAttendancePercentage(studentAttendancePercentage);

      const teacherAttendancePercentage =
        (summary.teacher.present /
          (summary.teacher.present +
            summary.teacher.absent +
            summary.teacher.late +
            summary.teacher.approved_leave)) *
        100;
      setTeacherAttendancePercentage(teacherAttendancePercentage);

      const adminAttendancePercentage =
        (summary.admin.present /
          (summary.admin.present +
            summary.admin.absent +
            summary.admin.late +
            summary.admin.approved_leave)) *
        100;
      setAdminAttendancePercentage(adminAttendancePercentage);

      // console.log(
      //   "studentAttendancePercentage",
      //   studentAttendancePercentage,
      //   teacherAttendancePercentage,
      //   adminAttendancePercentage
      // );

      // console.log(
      //   `Overall Attendance Percentage: ${overallAttendancePercentage.toFixed(
      //     2
      //   )}%`
      // );
    }
  }, [summary]);

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
  }, [users]);

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

              <div
                ref={attendanceCardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer"
              >
                <StatisticCard
                  title={`Overall Attendance (${currentMonth})`}
                  value={`${overallAttendance}%`}
                />

                {isHoverCardVisible && (
                  <div className="absolute bg-white border rounded shadow-lg p-4 z-10">
                    <h3 className="font-bold">Attendance Percentages</h3>
                    <p>Students: {studentAttendancePercentage.toFixed(2)}%</p>
                    <p>Teachers: {teacherAttendancePercentage.toFixed(2)}%</p>
                    <p>Admins: {adminAttendancePercentage.toFixed(2)}%</p>
                  </div>
                )}
              </div>

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

            {/* DASHBOARD CHARTS  */}

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
