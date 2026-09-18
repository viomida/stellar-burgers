import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import type { TUser } from '@utils-types';
import type { TRegisterData, TLoginData } from '@api';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

//чек
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async () => {
    const data = await getUserApi();
    return data.user;
  }
);

// логин
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

// рега
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

// экзит
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// ф5
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

// восстановление
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    await forgotPasswordApi(data);
  }
);

// сброс
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // чек
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      // логин
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // рега
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // экзит
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // ф5
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setAuthChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;