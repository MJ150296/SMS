import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

// Async thunk for logging in the user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/users/user_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result.message || "Something went wrong. Please try again."
        );
      }

      return result.data.user;
    } catch (err) {
      return rejectWithValue("Failed to login. Please try again later.");
    }
  }
);

// Async thunk for logging out the user
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/users/user_logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return rejectWithValue("Failed to log out.");
      }

      return {}; // Return empty data for now
    } catch (err) {
      return rejectWithValue("Error during logout.");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/users/update_user_profile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const result = await response.json();
        return rejectWithValue(result.message || "Failed to update profile.");
      }
      const result = await response.json(); // Get the response JSON
      // console.log(result);

      return result.updatedUser; // Return the updated user data
    } catch (err) {
      return rejectWithValue("Error updating profile.");
    }
  }
);

const currentUserSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null; // Clear user info on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null; // Clear user info on successful logout
        console.log(state.userInfo);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload; // Set error if logout fails
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        // You might want to keep the updated user info in state.userInfo
        // This can be adjusted based on what the API returns
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set error if updating fails
      });
  },
});

// Async thunk for updating user profile

export const { logout } = currentUserSlice.actions;
export default currentUserSlice.reducer;
