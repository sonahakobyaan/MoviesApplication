import type { User } from '@/types';

export type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }