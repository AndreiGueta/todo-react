import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../slices/mondaySlice';

export const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});
