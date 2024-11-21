// src/components/Dashboard.js

import React, { createContext, useCallback, useEffect, useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../Redux/slices/allUsersSlice.js";
import { fetchAllStudents } from "../../Redux/slices/allStudentSlice.js";
import { fetchAllClasses } from "../../Redux/slices/classSlice.js";
import { fetchAllTeachers } from "../../Redux/slices/allTeacherSlice.js";
import { fetchAllAdmins } from "../../Redux/slices/allAdminSlice.js";
import { fetchAttendanceSummary } from "../../Redux/slices/allAttendanceSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { students } = useSelector((state) => state.allStudents);
  const { users } = useSelector((state) => state.allUsers);

  useEffect(() => {
    if (users) {

      dispatch(fetchAllUsers());
      if(students){
        dispatch(fetchAllClasses());
      }
      dispatch(fetchAllStudents());

      dispatch(fetchAttendanceSummary());

      dispatch(fetchAllTeachers());

      dispatch(fetchAllAdmins());
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4">
          <Outlet />
          {/* First Page is UserStatistics */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
