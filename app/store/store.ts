import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/api/apiSlice';
import authReducer from '../store/slices/other/authSlice';
import currentProjectReducer from './slices/other/currentProjectSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    currentProject: currentProjectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
