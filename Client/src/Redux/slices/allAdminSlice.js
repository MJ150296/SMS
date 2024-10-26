import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch admins from the server
export const fetchAllAdmins = createAsyncThunk(
  "allAdmins/fetchAllAdmins",
  async () => {
    const response = await axios.get("/api/v1/admins/all_admins"); // Replace with your actual API endpoint

    const allAdminsList = response.data?.data?.data; // Getting the list of all admins
    return allAdminsList;
  }
);

const initialState = {
  admins: null,
  isLoading: false,
  error: null,
};

const allAdminsSlice = createSlice({
  name: "allAdmins",
  initialState,
  reducers: {
    addAdmin: (state, action) => {
      state.admins.push(action.payload); // Add a new admin to the list
    },
    updateAdmin: (state, action) => {
      const index = state.admins.findIndex(
        (admin) => admin.id === action.payload.id
      );
      if (index !== -1) {
        state.admins[index] = action.payload; // Update the admin information
      }
    },
    deleteAdmin: (state, action) => {
      state.admins = state.admins.filter(
        (admin) => admin.id !== action.payload
      ); // Remove the admin by id
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = action.payload; // Set fetched admins
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Capture error message
      });
  },
});

export const { addAdmin, updateAdmin, deleteAdmin } = allAdminsSlice.actions;
export default allAdminsSlice.reducer;
