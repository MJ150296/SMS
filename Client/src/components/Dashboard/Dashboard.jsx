// src/components/Dashboard.js

import React, { createContext, useEffect, useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../Redux/slices/allUsersSlice.js";
import { fetchAllStudents } from "../../Redux/slices/allStudentSlice.js";
import { fetchAllClasses } from "../../Redux/slices/classSlice.js";
import { fetchAllTeachers } from "../../Redux/slices/allTeacherSlice.js";
import { fetchAllAdmins } from "../../Redux/slices/allAdminSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { users, isLoading, error } = useSelector((state) => state.allUsers);
  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllClasses());
    dispatch(fetchAllUsers());
    dispatch(fetchAllTeachers());
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      console.log("All Users", users);
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
