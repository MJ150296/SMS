import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch users from the server
export const fetchAllUsers = createAsyncThunk(
  "allUsers/fetchAllUsers",
  async () => {
    const response = await axios.get("/api/v1/users/all_users"); // Replace with your actual API endpoint
    // console.log(response.data?.data?.data);
    const allUsersList = response.data?.data?.data; // DON'T DELETE ---- It is getting the list of all users
    return allUsersList;
  }
);

const initialState = {
  users: null,
  isLoading: false,
  error: null,
};

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    // Existing reducers
    addUser: (state, action) => {
      state.users.push(action.payload); // Add a new user to the list
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload; // Update the user information
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload); // Remove the user by id
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser } = allUsersSlice.actions;
export default allUsersSlice.reducer;
