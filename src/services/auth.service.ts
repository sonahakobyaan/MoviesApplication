import api from '@/services/api';
import type { AuthResponse, User } from '@/types';

export const AuthService = {
  login: async (credentials: Pick<User, 'email' | 'password'>) => {
    const response = await api.post<AuthResponse>('/me/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  register: async (userData: Pick<User, 'name' | 'email' | 'password'>) => {
    const response = await api.post('/me/register', userData);
    return response.data;
  },

  getUserData: async (token: string) => {
    const response = await api.post<AuthResponse>('/me/user', { token });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};