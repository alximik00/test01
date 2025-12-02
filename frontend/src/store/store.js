import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemsReducer from './itemsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
  },
});

