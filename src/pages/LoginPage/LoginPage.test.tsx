import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from './LoginPage';
import userReducer from '../../store/slices/userSlice';
import moviesReducer from '../../store/slices/moviesSlice';

const createStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
    },
  });

describe('LoginPage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('renders login page at /login route', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('displays netflixroulette logo', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/netflix/)).toBeInTheDocument();
    expect(screen.getByText(/roulette/)).toBeInTheDocument();
  });

  it('displays error message when error prop is passed', () => {
    const store = configureStore({
      reducer: {
        user: userReducer,
        movies: moviesReducer,
      },
      preloadedState: {
        user: {
          user: null,
          isAuthenticated: false,
          loading: false,
          error: 'Invalid email or password',
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

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });
});
