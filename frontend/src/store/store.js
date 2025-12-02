import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemsReducer from './itemsSlice';
import listingsReducer from './listingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    listings: listingsReducer,
  },
});

