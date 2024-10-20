// src/components/Header.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/slices/currentUserSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userInfo, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo) {  // It means logged out
      navigate("/", {
        state: { loggedOut: true },
      }); // Navigate to the home page on successful logout
    }
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
