import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AppRoutes } from '@/App';
import userReducer from '@/store/slices/userSlice';
import moviesReducer from '@/store/slices/moviesSlice';

const createStore = (isAuthenticated: boolean) =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
    },
    preloadedState: {
      user: {
        user: isAuthenticated
          ? { id: 1, name: 'John', email: 'john@test.com', role: 'user' } as const
          : null,
        isAuthenticated,
        loading: false,
        error: null,
      },
      movies: {
        movies: [],
        total: 0,
        loading: false,
        error: null,
        selectedMovie: null,
        selectedMovieLoading: false,
      },
    },
  });

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('renders login page when navigating to /login', () => {
    const store = createStore(false);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument();
  });

  it('redirects to login when accessing protected route without auth', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const store = createStore(false);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument();
  });
});
