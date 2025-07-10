import { configureStore } from '@reduxjs/toolkit';
import baseReducer from '../features/base/baseSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    base: baseReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
