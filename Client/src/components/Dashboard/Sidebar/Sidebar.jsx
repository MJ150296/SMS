// src/components/Sidebar.js

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Loading from "../../Loading.jsx";

const Sidebar = () => {
  const { userInfo, isLoading, error } = useSelector((state) => state.user);

  const [userDataLoaded, setUserDataLoaded] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setUserDataLoaded(true);
      console.log("Current User", userInfo);
    }
  }, [userInfo]);

  return (
    <>
      <div className="bg-gray-800 text-white w-64 min-h-screen">
        {userDataLoaded ? (
          <>
            <div className="p-4 flex flex-col items-center">
              <img
                src={userInfo?.avatarUrl || "https://res.cloudinary.com/dzmjjm2kn/image/upload/v1729203068/smsLogo_xnewfo.jpg"} // Use a default image if avatarUrl is not available
                alt={`${userInfo?.fullName}'s avatar`}
                className="w-32 h-32 rounded-full mb-2" // Adjust the width, height, and margin as needed
              />
              <h1 className="text-2xl font-bold">{userInfo?.fullName || ""}</h1>
              <h2 className="text-base">{userInfo?.role}</h2>
            </div>
            <nav className="m-6">
              <NavLink
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/manage_users"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Manage Users
              </NavLink>
              <NavLink
                to="/dashboard/reports"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Reports
              </NavLink>
              <NavLink
                to="/dashboard/school_profile"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                School Profile
              </NavLink>
              <NavLink
                to="/dashboard/user_settings"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                User Settings
              </NavLink>
            </nav>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
};

export default Sidebar;
