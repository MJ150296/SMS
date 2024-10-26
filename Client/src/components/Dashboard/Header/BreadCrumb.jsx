import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function BreadCrumb() {
  const [componentName, setComponentName] = useState("");

  const location = useLocation();
  // Map full paths to their respective component names
  const routesMap = {
    "/": "SuperAdminRegistration",
    "/dashboard": "Dashboard",
    "/dashboard/school_profile": "SchoolProfile",
    "/dashboard/manage_users": "ManageUsers",
    "/dashboard/reports": "Reports",
    "/dashboard/events": "Events",
    "/dashboard/user_settings": "UserSettings",
    "/dashboard/new_user_registration": "User Registration",
    "/dashboard/user_statistics": "User Statistics",
    "/dashboard/student_details": "Student Details",
  };

  // console.log("Mounted Component:", location.pathname);

  useEffect(() => {
    // Get the component name based on the current path
    setComponentName(routesMap[location.pathname] || "Unknown Component");
    // console.log("Mounted Component:", componentName);
  }, [location.pathname]);

  return (
    <div>
      <p className="text-lg font-medium">{componentName}</p>
    </div>
  );
}

export default BreadCrumb;
