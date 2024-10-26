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
      });
  },
});

export const { addClass, updateClass, deleteClass } = allClassesSlice.actions;
export default allClassesSlice.reducer;
