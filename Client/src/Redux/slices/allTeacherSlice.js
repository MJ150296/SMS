import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch teachers from the server
export const fetchAllTeachers = createAsyncThunk(
  "allTeachers/fetchAllTeachers",
  async () => {
    const response = await axios.get("/api/v1/teachers/all_teachers"); // Replace with your actual API endpoint

    const allTeachersList = response.data?.data?.data; // Getting the list of all teachers

    // console.log("All Teacher", allTeachersList);

    return allTeachersList;
  }
);

const initialState = {
  teachers: null,
  isLoading: false,
  error: null,
};

const allTeachersSlice = createSlice({
  name: "allTeachers",
  initialState,
  reducers: {
    // Add a new teacher to the list
    addTeacher: (state, action) => {
      state.teachers.push(action.payload);
    },
    // Update teacher information
    updateTeacher: (state, action) => {
      const index = state.teachers.findIndex(
        (teacher) => teacher.id === action.payload.id
      );
      if (index !== -1) {
        state.teachers[index] = action.payload;
      }
    },
    // Delete teacher by ID
    deleteTeacher: (state, action) => {
      state.teachers = state.teachers.filter(
        (teacher) => teacher.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTeachers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teachers = action.payload; // Set fetched teachers
      })
      .addCase(fetchAllTeachers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Capture error message
      });
  },
});

export const { addTeacher, updateTeacher, deleteTeacher } =
  allTeachersSlice.actions;
export default allTeachersSlice.reducer;
