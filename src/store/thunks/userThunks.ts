import { createAsyncThunk } from '@reduxjs/toolkit';

import { AuthService } from '@/services/auth.service';

export const loginThunk = createAsyncThunk(
    'user/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await AuthService.login(credentials);
        return response.data;
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const errorMessage = axiosErr?.response?.data?.message || 'Invalid email or password';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  export const getUserThunk = createAsyncThunk(
    'user/getUser',
    async (token: string, { rejectWithValue }) => {
      try {
        const response = await AuthService.getUserData(token);
        return response.data;
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        return rejectWithValue(axiosErr?.response?.data?.message || 'Invalid token');
      }
    }
  );