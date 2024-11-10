// adminSalarySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API endpoint for admin salary structures
const API_URL = "/api/v1/salary/admin_salary_structure";

// Thunks for async actions

// Create a new admin salary structure
export const createAdminSalaryStructure = createAsyncThunk(
  "adminSalary/create",
  async (salaryData, { rejectWithValue }) => {
    console.log("salaryData", salaryData);

    try {
      const response = await axios.post(API_URL, salaryData);
      console.log(response.data?.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating admin salary structure"
      );
    }
  }
);

// Fetch all admin salary structures
export const fetchAllAdminSalaryStructures = createAsyncThunk(
  "adminSalary/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching admin salary structures"
      );
    }
  }
);

// Fetch a single admin salary structure by ID
export const fetchAdminSalaryStructureById = createAsyncThunk(
  "adminSalary/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching admin salary structure"
      );
    }
  }
);

// Update an admin salary structure by ID
export const updateAdminSalaryStructure = createAsyncThunk(
  "adminSalary/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating admin salary structure"
      );
    }
  }
);

// Delete an admin salary structure by ID
export const deleteAdminSalaryStructure = createAsyncThunk(
  "adminSalary/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting admin salary structure"
      );
    }
  }
);

// Initial state for the slice
const initialState = {
  adminSalaryStructures: [],
  selectedAdminSalaryStructure: null,
  loading: false,
  error: null,
};

// Admin Salary Structure Slice
const adminSalarySlice = createSlice({
  name: "adminSalary",
  initialState,
  reducers: {
    clearSelectedAdminSalaryStructure: (state) => {
      state.selectedAdminSalaryStructure = null;
    },
  },
  extraReducers: (builder) => {
    // Handle each thunk action for loading, success, and error states

    // Create admin salary structure
    builder
      .addCase(createAdminSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.adminSalaryStructures.push(action.payload);
      })
      .addCase(createAdminSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all admin salary structures
    builder
      .addCase(fetchAllAdminSalaryStructures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdminSalaryStructures.fulfilled, (state, action) => {
        state.loading = false;
        state.adminSalaryStructures = action.payload;
      })
      .addCase(fetchAllAdminSalaryStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch admin salary structure by ID
    builder
      .addCase(fetchAdminSalaryStructureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSalaryStructureById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdminSalaryStructure = action.payload;
      })
      .addCase(fetchAdminSalaryStructureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update admin salary structure
    builder
      .addCase(updateAdminSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.adminSalaryStructures.findIndex(
          (salary) => salary._id === action.payload._id
        );
        if (index !== -1) {
          state.adminSalaryStructures[index] = action.payload;
        }
      })
      .addCase(updateAdminSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete admin salary structure
    builder
      .addCase(deleteAdminSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.adminSalaryStructures = state.adminSalaryStructures.filter(
          (salary) => salary._id !== action.payload
        );
      })
      .addCase(deleteAdminSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearSelectedAdminSalaryStructure } = adminSalarySlice.actions;
export default adminSalarySlice.reducer;
