// teacherSalarySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API endpoint for teacher salary structures
const API_URL = "/api/v1/salary/teacher_salary_structure";

// Thunks for async actions

// Create a new teacher salary structure
export const createTeacherSalaryStructure = createAsyncThunk(
  "teacherSalary/create",
  async (salaryData, { rejectWithValue }) => {
    console.log("salaryData", salaryData);

    try {
      const response = await axios.post(API_URL, salaryData);
      console.log(response.data?.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error creating teacher salary structure"
      );
    }
  }
);

// Fetch all teacher salary structures
export const fetchAllTeacherSalaryStructures = createAsyncThunk(
  "teacherSalary/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching teacher salary structures"
      );
    }
  }
);

// Fetch a single teacher salary structure by ID
export const fetchTeacherSalaryStructureById = createAsyncThunk(
  "teacherSalary/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching teacher salary structure"
      );
    }
  }
);

// Update a teacher salary structure by ID
export const updateTeacherSalaryStructure = createAsyncThunk(
  "teacherSalary/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error updating teacher salary structure"
      );
    }
  }
);

// Delete a teacher salary structure by ID
export const deleteTeacherSalaryStructure = createAsyncThunk(
  "teacherSalary/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error deleting teacher salary structure"
      );
    }
  }
);

// Initial state for the slice
const initialState = {
  teacherSalaryStructures: [],
  selectedTeacherSalaryStructure: null,
  loading: false,
  error: null,
};

// Teacher Salary Structure Slice
const teacherSalarySlice = createSlice({
  name: "teacherSalary",
  initialState,
  reducers: {
    clearSelectedTeacherSalaryStructure: (state) => {
      state.selectedTeacherSalaryStructure = null;
    },
  },
  extraReducers: (builder) => {
    // Handle each thunk action for loading, success, and error states

    // Create teacher salary structure
    builder
      .addCase(createTeacherSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacherSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherSalaryStructures.push(action.payload);
      })
      .addCase(createTeacherSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all teacher salary structures
    builder
      .addCase(fetchAllTeacherSalaryStructures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeacherSalaryStructures.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherSalaryStructures = action.payload;
      })
      .addCase(fetchAllTeacherSalaryStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch teacher salary structure by ID
    builder
      .addCase(fetchTeacherSalaryStructureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherSalaryStructureById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeacherSalaryStructure = action.payload;
      })
      .addCase(fetchTeacherSalaryStructureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update teacher salary structure
    builder
      .addCase(updateTeacherSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teacherSalaryStructures.findIndex(
          (salary) => salary._id === action.payload._id
        );
        if (index !== -1) {
          state.teacherSalaryStructures[index] = action.payload;
        }
      })
      .addCase(updateTeacherSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete teacher salary structure
    builder
      .addCase(deleteTeacherSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacherSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherSalaryStructures = state.teacherSalaryStructures.filter(
          (salary) => salary._id !== action.payload
        );
      })
      .addCase(deleteTeacherSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearSelectedTeacherSalaryStructure } =
  teacherSalarySlice.actions;
export default teacherSalarySlice.reducer;
