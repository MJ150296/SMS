import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SuperAdminRegistration from "./components/Home/SuperAdminRegistration.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { store } from "./Redux/store.js";
import { Provider } from "react-redux";
import ManageUsers from "./components/Dashboard/Sidebar/ManageUsers/ManageUsers.jsx";
import Reports from "./components/Dashboard/Sidebar/Reports/Reports.jsx";
import UserSettings from "./components/Dashboard/Sidebar/UserSettings/UserSettings.jsx";
import SchoolProfile from "./components/Dashboard/Sidebar/SchoolProfile/SchoolProfile.jsx";
import UserRegistration from "./components/Dashboard/Sidebar/ManageUsers/UserRegistration.jsx";
import UserStatistics from "./components/Dashboard/Outlet/UserStatistics.jsx";
import StudentDetails from "./components/Dashboard/Outlet/Total Students/StudentDetails.jsx";
import TeacherDetails from "./components/Dashboard/Outlet/Total Teachers/TeacherDetails.jsx";
import AdminDetails from "./components/Dashboard/Outlet/Total Admins/AdminDetails.jsx";
import EventManagement from "./components/Dashboard/Sidebar/Events/EventManagement.jsx";
import CalendarComponent from "./components/Dashboard/Sidebar/Calendar/CalendarComponent.jsx";
import AttendanceMarking from "./components/Dashboard/Sidebar/Attendance/MarkAttendance.jsx";
import FeeStructureSetup from "./components/Dashboard/Sidebar/Fee Structure/FeeStructureSetup.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<SuperAdminRegistration />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<UserStatistics />} />
        <Route path="school_profile" element={<SchoolProfile />} />
        <Route path="manage_users" element={<ManageUsers />} />
        <Route path="calendar" element={<CalendarComponent />} />
        <Route path="reports" element={<Reports />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="user_settings" element={<UserSettings />} />
        <Route path="new_user_registration" element={<UserRegistration />} />
        <Route path="student_details" element={<StudentDetails />} />
        <Route path="teacher_details" element={<TeacherDetails />} />
        <Route path="admin_details" element={<AdminDetails />} />
        <Route path="attendance" element={<AttendanceMarking />} />
        <Route path="fee_structure" element={<FeeStructureSetup />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>
);
