import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch students from the server
export const fetchAllStudents = createAsyncThunk(
  "allStudents/fetchAllStudents",
  async () => {
    const response = await axios.get("/api/v1/students/all_students"); // Replace with your actual API endpoint

    const allStudentsList = response.data?.data?.data; // Getting the list of all students
    // console.log("All students", allStudentsList);
    return allStudentsList;
  }
);

const initialState = {
  students: null,
  isLoading: false,
  error: null,
};

const allStudentsSlice = createSlice({
  name: "allStudents",
  initialState,
  reducers: {
    // Existing reducers
    addStudent: (state, action) => {
      state.students.push(action.payload); // Add a new student to the list
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(
        (student) => student.id === action.payload.id
      );
      if (index !== -1) {
        state.students[index] = action.payload; // Update the student information
      }
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(
        (student) => student.id !== action.payload
      ); // Remove the student by id
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload; // Set fetched students
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Capture error message
      });
  },
});

export const { addStudent, updateStudent, deleteStudent } =
  allStudentsSlice.actions;
export default allStudentsSlice.reducer;
