import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch classes from the server
export const fetchAllClasses = createAsyncThunk(
  "allClasses/fetchAllClasses",
  async () => {
    const response = await axios.get("/api/v1/classes/all_classes"); // Replace with your actual API endpoint

    const allClassesList = response.data?.data?.data; // Getting the list of all classes
    // console.log("All classes", response.data);
    return allClassesList;
  }
);

// Async thunk to update class teacher
export const updateClassTeacher = createAsyncThunk(
  "allClasses/updateClassTeacher",
  async ({ classId, teacherId }, { rejectWithValue }) => {
    // console.log("Class and teacher ID");

    // console.log(classId, teacherId);

    try {
      const response = await axios.patch(
        `/api/v1/classes/updateClassTeacher/${classId}`,
        {
          classTeacher: teacherId,
        }
      );
      console.log(response.data?.data);

      return response.data?.data; // Assume the updated class is returned
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors
    }
  }
);

const initialState = {
  classes: null,
  isLoading: false,
  error: null,
};

const allClassesSlice = createSlice({
  name: "allClasses",
  initialState,
  reducers: {
    addClass: (state, action) => {
      state.classes.push(action.payload); // Add a new class to the list
    },
    updateClass: (state, action) => {
      const index = state.classes.findIndex(
        (classItem) => classItem.id === action.payload.id
      );
      if (index !== -1) {
        state.classes[index] = action.payload; // Update the class information
      }
    },
    deleteClass: (state, action) => {
      state.classes = state.classes.filter(
        (classItem) => classItem.id !== action.payload
      ); // Remove the class by id
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllClasses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload; // Set fetched classes
      })
      .addCase(fetchAllClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Capture error message
      })
      .addCase(updateClassTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClassTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        // Find the index of the updated class and replace it
        const index = state.classes.findIndex(
          (cls) => cls._id === action.payload._id
        );
        if (index !== -1) {
          state.classes[index] = action.payload; // Update the class
        }
      })
      .addCase(updateClassTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addClass, updateClass, deleteClass } = allClassesSlice.actions;
export default allClassesSlice.reducer;
