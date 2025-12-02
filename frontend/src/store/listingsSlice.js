import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const searchListings = createAsyncThunk(
  'listings/searchListings',
  async ({ city, checkIn, checkOut, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/listings', {
        params: {
          city,
          check_in: checkIn,
          check_out: checkOut,
          page,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch listings'
      );
    }
  }
);

const listingsSlice = createSlice({
  name: 'listings',
  initialState: {
    listings: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 0,
      count: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchListings.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        // Normalize payload into an array of listings
        if (Array.isArray(payload)) {
          state.listings = payload;
        } else if (payload && Array.isArray(payload.listings)) {
          state.listings = payload.listings;
        } else if (payload && Array.isArray(payload.data)) {
          state.listings = payload.data;
        } else {
          // Unexpected shape (e.g. { error: ... }), reset to empty array
          state.listings = [];
        }

        // Store pagination info if present
        if (payload && payload.pagi_info) {
          state.pagination = {
            page: payload.pagi_info.page || 1,
            perPage: payload.pagi_info.per_page || 0,
            count: payload.pagi_info.count || 0,
          };
        } else {
          state.pagination = { page: 1, perPage: 0, count: state.listings.length };
        }
      })
      .addCase(searchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = listingsSlice.actions;
export default listingsSlice.reducer;


