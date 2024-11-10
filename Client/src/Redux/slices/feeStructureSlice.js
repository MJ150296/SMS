
  ////////////        FEE STRUCTURE SLICE       //////////////////

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API endpoint for fee structures
const API_URL = "/api/v1/fees/fee_structures";

// Thunks for async actions

// Create a new fee structure
export const createFeeStructure = createAsyncThunk(
  "feeStructure/create",
  async (feeData, { rejectWithValue }) => {
    console.log("feeData", feeData);

    try {
      const response = await axios.post(API_URL, feeData);
      console.log(response.data?.data);
      // return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating fee structure"
      );
    }
  }
);

// Fetch all fee structures
export const fetchAllFeeStructures = createAsyncThunk(
  "feeStructure/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching fee structures"
      );
    }
  }
);

// Fetch a single fee structure by ID
export const fetchFeeStructureById = createAsyncThunk(
  "feeStructure/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching fee structure"
      );
    }
  }
);

// Update a fee structure by ID
export const updateFeeStructure = createAsyncThunk(
  "feeStructure/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating fee structure"
      );
    }
  }
);

// Delete a fee structure by ID
export const deleteFeeStructure = createAsyncThunk(
  "feeStructure/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting fee structure"
      );
    }
  }
);

// Initial state for the slice
const initialState = {
  feeStructures: [],
  selectedFeeStructure: null,
  loading: false,
  error: null,
};

// Fee Structure Slice
const feeStructureSlice = createSlice({
  name: "feeStructure",
  initialState,
  reducers: {
    clearSelectedFeeStructure: (state) => {
      state.selectedFeeStructure = null;
    },
  },
  extraReducers: (builder) => {
    // Handle each thunk action for loading, success, and error states

    // Create fee structure
    builder
      .addCase(createFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.feeStructures.push(action.payload);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all fee structures
    builder
      .addCase(fetchAllFeeStructures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeeStructures.fulfilled, (state, action) => {
        state.loading = false;
        state.feeStructures = action.payload;
      })
      .addCase(fetchAllFeeStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch fee structure by ID
    builder
      .addCase(fetchFeeStructureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeStructureById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFeeStructure = action.payload;
      })
      .addCase(fetchFeeStructureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update fee structure
    builder
      .addCase(updateFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.feeStructures.findIndex(
          (fee) => fee._id === action.payload._id
        );
        if (index !== -1) {
          state.feeStructures[index] = action.payload;
        }
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete fee structure
    builder
      .addCase(deleteFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.feeStructures = state.feeStructures.filter(
          (fee) => fee._id !== action.payload
        );
      })
      .addCase(deleteFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearSelectedFeeStructure } = feeStructureSlice.actions;
export default feeStructureSlice.reducer;
