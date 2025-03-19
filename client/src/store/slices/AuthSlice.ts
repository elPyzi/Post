import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
