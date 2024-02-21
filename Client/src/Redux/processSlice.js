// src/redux/processSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state for the process data
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

// Create an async thunk to fetch process data from the backend
export const fetchProcessData = createAsyncThunk('process/fetchProcessData', async () => {
  try {
    const response = await fetch('http://localhost:8080/api/runningprocess');
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching process data from the backend');
  }
});

// Create a slice for the process data
const processSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcessData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProcessData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProcessData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


// Export the reducer for use in the store
export default processSlice.reducer;
