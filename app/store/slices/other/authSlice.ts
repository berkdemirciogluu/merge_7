import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Auth } from '../../../models/auth';
import {
  getAuthToken,
  getRefreshToken,
  removeUserCredentials,
  setUserCredentials,
} from '../../../utils/auth';
import { RootState } from '../../store';

const initialState: Auth.State = {
  access_token: getAuthToken(),
  refresh_token: getRefreshToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Auth.State>) => {
      state = action.payload;
      const { access_token, refresh_token } = action.payload;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      setUserCredentials(access_token, refresh_token);
    },
    logOut: (state) => {
      state.access_token = '';
      state.refresh_token = '';
      removeUserCredentials();
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentAccessToken = (state: RootState) =>
  state.auth.access_token;
export const selectCurrentRefreshToken = (state: RootState) =>
  state.auth.refresh_token;
