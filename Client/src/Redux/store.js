import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./slices/currentUserSlice.js"; // User slice we'll create
import allUsersReducer from "./slices/allUsersSlice.js";
import schoolProfileReducer from "./slices/schoolProfileDataSlice.js";
import allStudentReducer from "./slices/allStudentSlice.js";
import allClassesReducer from "./slices/classSlice.js";
import allTeacherReducer from "./slices/allTeacherSlice.js";
import allAdminReducer from "./slices/allAdminSlice.js";
import eventReducer from "./slices/eventSlice.js";
import allAttendanceReducer from "./slices/allAttendanceSlice.js"

export const store = configureStore({
  reducer: {
    user: currentUserReducer, // For managing current logged-in user state
    allUsers: allUsersReducer, // For managing all users data
    schoolProfile: schoolProfileReducer, // For managing school profile data
    allStudents: allStudentReducer,
    allClasses: allClassesReducer,
    allTeachers: allTeacherReducer,
    allAdmins: allAdminReducer,
    events: eventReducer,
    attendance: allAttendanceReducer,
  },
});
