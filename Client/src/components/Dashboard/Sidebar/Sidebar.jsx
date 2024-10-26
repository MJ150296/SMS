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

  // Function to render NavLinks based on role
  const renderNavLinks = () => {
    switch (userInfo?.role) {
      case "superAdmin":
        return (
          <>
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
              to="/dashboard/events"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Events
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
          </>
        );
      case "admin":
        return (
          <>
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
              to="/dashboard/manage_teachers"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Manage Teachers
            </NavLink>
            <NavLink
              to="/dashboard/manage_classes"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Manage Classes
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
          </>
        );
      case "teacher":
        return (
          <>
            <NavLink
              to="/dashboard"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/my_classes"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              My Classes
            </NavLink>
            <NavLink
              to="/dashboard/attendance"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Attendance
            </NavLink>
            <NavLink
              to="/dashboard/gradebook"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Gradebook
            </NavLink>
            <NavLink
              to="/dashboard/class_resources"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Class Resources
            </NavLink>
            <NavLink
              to="/dashboard/reports"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Reports
            </NavLink>
            <NavLink
              to="/dashboard/user_settings"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              User Settings
            </NavLink>
          </>
        );
      case "student":
        return (
          <>
            <NavLink
              to="/dashboard"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/my_classes"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              My Classes
            </NavLink>
            <NavLink
              to="/dashboard/attendance"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Attendance
            </NavLink>
            <NavLink
              to="/dashboard/gradebook"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Gradebook
            </NavLink>
            <NavLink
              to="/dashboard/assignments"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Assignments
            </NavLink>
            <NavLink
              to="/dashboard/reports"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Reports
            </NavLink>
            <NavLink
              to="/dashboard/user_settings"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              User Settings
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      {userDataLoaded ? (
        <>
          <div className="p-4 flex flex-col items-center">
            <img
              src={
                userInfo?.avatarUrl ||
                "https://res.cloudinary.com/dzmjjm2kn/image/upload/v1729203068/smsLogo_xnewfo.jpg"
              }
              alt={`${userInfo?.fullName}'s avatar`}
              className="w-32 h-32 rounded-full mb-2"
            />
            <h1 className="text-2xl font-bold">{userInfo?.fullName || ""}</h1>
            <h2 className="text-base">{userInfo?.role}</h2>
          </div>
          <nav className="m-6">{renderNavLinks()}</nav>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Sidebar;
