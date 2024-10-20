import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer from './slices/currentUserSlice.js' // User slice we'll create
import allUsersReducer from './slices/allUsersSlice.js'
import schoolProfileReducer from './slices/schoolProfileDataSlice.js'

export const store = configureStore({
  reducer: {
    user: currentUserReducer,    // For managing current logged-in user state
    allUsers: allUsersReducer,   // For managing all users data
    schoolProfile: schoolProfileReducer, // For managing school profile data
  },
});
