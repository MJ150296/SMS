// src/components/Dashboard.js

import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../Redux/slices/allUsersSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { users, isLoading, error } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(fetchAllUsers());
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
          {/* You can add more components here like charts, tables, etc. */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
