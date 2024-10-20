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
import UserStatistics from "./components/Dashboard/UserStatistics.jsx";
import ManageUsers from "./components/Dashboard/Sidebar/ManageUsers/ManageUsers.jsx";
import Reports from "./components/Dashboard/Sidebar/Reports/Reports.jsx";
import UserSettings from "./components/Dashboard/Sidebar/UserSettings/UserSettings.jsx";
import SchoolProfile from "./components/Dashboard/Sidebar/SchoolProfile/SchoolProfile.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<SuperAdminRegistration />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<UserStatistics />} />
        <Route path="school_profile" element={<SchoolProfile />} />
        <Route path="manage_users" element={<ManageUsers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="user_settings" element={<UserSettings />} />        
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
