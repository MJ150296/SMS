import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching school profile
export const fetchSchoolProfile = createAsyncThunk(
  "schoolProfile/fetchSchoolProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/school/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating school profile
export const updateSchoolProfile = createAsyncThunk(
  "schoolProfile/updateSchoolProfile",
  async (formData, { rejectWithValue }) => {
    try {
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      const response = await axios.post("/api/v1/school/update", formData, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue("Error updating school profile");
      }
      // console.log("Here");

      console.log(response.data.data.school);

      const updatedSchool = response.data.data.school;

      if (!updatedSchool) {
        console.log("School not updated schoolProfileDataSlice");
      }

      return updatedSchool; // because we are getting data.school in schoolProfile.jsx
    } catch (error) {
      console.log("Error in school data slice");
      console.log(error);
      // return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  schoolProfile: null,
  isLoading: false,
  error: null,
};

const schoolProfileDataSlice = createSlice({
  name: "schoolProfile",
  initialState,
  reducers: {
    deleteSchoolProfile: (state) => {
      state.schoolProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSchoolProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schoolProfile = action.payload;
      })
      .addCase(fetchSchoolProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSchoolProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSchoolProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schoolProfile = action.payload;
      })
      .addCase(updateSchoolProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { deleteSchoolProfile } = schoolProfileDataSlice.actions;

export default schoolProfileDataSlice.reducer;
