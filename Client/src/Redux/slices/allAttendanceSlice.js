// allAttendanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state
const initialState = {
  attendanceRecords: [], // for detailed paginated data
  summary: null, // for dashboard summary
  totalPages: 0, // for pagination
  loading: false,
  error: null,
  summaryLoading: false, // separate loading states for each type
  summaryError: null,
};

// Async thunk to fetch attendance summary for the dashboard
export const fetchAttendanceSummary = createAsyncThunk(
  "attendance/fetchSummary",
  async () => {
    const response = await axios.get("/api/v1/attendance/summary");
    // console.log("Attendance summary ", response.data);
    return response.data?.summary; // Expecting aggregated summary data from backend
  }
);

// Async thunk to fetch paginated attendance data for detailed reports
export const fetchPaginatedAttendance = createAsyncThunk(
  "attendance/fetchPaginated",
  async ({ page, startDate, endDate }) => {
    const response = await axios.get("/api/v1/attendance/paginated", {
      params: { page, startDate, endDate },
    });
    return response.data; // Expecting paginated data and totalPages from backend
  }
);

// Async thunk to add an attendance record
export const addAttendance = createAsyncThunk(
  "attendance/add",
  async (attendanceData) => {
    console.log(attendanceData);
    const response = await axios.post(
      "/api/v1/attendance/add_attendance",
      attendanceData
    );
    return response.data;
  }
);

// Async thunk to update an attendance record
export const updateAttendance = createAsyncThunk(
  "attendance/update",
  async ({ id, attendanceData }) => {
    const response = await axios.put(`/api/attendance/${id}`, attendanceData);
    return response.data;
  }
);

// Async thunk to delete an attendance record
export const deleteAttendance = createAsyncThunk(
  "attendance/delete",
  async (id) => {
    await axios.delete(`/api/attendance/${id}`);
    return id;
  }
);

// Create the slice
const allAttendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchAttendanceSummary for dashboard
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.error.message;
      })

      // Handle fetchPaginatedAttendance for reports
      .addCase(fetchPaginatedAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaginatedAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload.records;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPaginatedAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addAttendance.fulfilled, (state, action) => {
        state.attendanceRecords.push(action.payload);
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        const index = state.attendanceRecords.findIndex(
          (record) => record._id === action.payload._id
        );
        if (index !== -1) {
          state.attendanceRecords[index] = action.payload;
        }
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.attendanceRecords = state.attendanceRecords.filter(
          (record) => record._id !== action.payload
        );
      });
  },
});

// Export the reducer to be used in the store
export default allAttendanceSlice.reducer;
