import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';
import userReducer from '../../store/slices/userSlice';
import moviesReducer from '../../store/slices/moviesSlice';
import { fetchMoviesThunk } from '@/store/thunks/movieThunks';

vi.mock('@/store/thunks/movieThunks', () => {
  const createMockThunk = (type: string) => {
    const thunk = vi.fn(() => ({ 
      type: `${type}/fulfilled`, 
      payload: { data: [], total: 0 } 
    }));
    return Object.assign(thunk, {
      pending: { type: `${type}/pending` },
      fulfilled: { type: `${type}/fulfilled` },
      rejected: { type: `${type}/rejected` },
    });
  };

  return {
    fetchMoviesThunk: createMockThunk('movies/fetchAll'),
    fetchMovieByIdThunk: createMockThunk('movies/fetchById'),
    addMovieThunk: createMockThunk('movies/add'),
    updateMovieThunk: createMockThunk('movies/update'),
    deleteMovieThunk: createMockThunk('movies/delete'),
  };
});

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
    },
    preloadedState,
  });

describe('HomePage', () => {
  const initialState = {
    user: {
      user: { id: 1, name: 'John Doe', email: 'john@test.com', role: 'admin' as const },
      isAuthenticated: true,
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('fake-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('renders correctly and dispatches fetchMoviesThunk on mount', async () => {
    const store = createTestStore(initialState);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/FIND YOUR MOVIE/i)).toBeInTheDocument();
    expect(fetchMoviesThunk).toHaveBeenCalled();
  });

  it('updates search query state and dispatches search on button click', async () => {
    const user = userEvent.setup();
    const store = createTestStore(initialState);
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/what do you want to watch/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Interstellar');
    await user.click(searchButton);

    expect(fetchMoviesThunk).toHaveBeenLastCalledWith(expect.objectContaining({
      search: 'Interstellar',
      searchBy: 'title'
    }));
  });

  it('triggers search when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const store = createTestStore(initialState);
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/what do you want to watch/i);
    await user.type(input, 'Inception{enter}');

    expect(fetchMoviesThunk).toHaveBeenLastCalledWith(expect.objectContaining({
      search: 'Inception',
      searchBy: 'title'
    }));
  });

  it('filters by genre and dispatches thunk', async () => {
    const store = createTestStore(initialState);
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    const genreButton = await screen.findByText(/documentary/i);
    fireEvent.click(genreButton);

    expect(fetchMoviesThunk).toHaveBeenLastCalledWith(expect.objectContaining({
      filter: 'Documentary'
    }));
  });

  it('displays error message if movie fetch fails', async () => {
    const errorMessage = 'Failed to fetch movies from server';
    const store = createTestStore({
      ...initialState,
      movies: { ...initialState.movies, error: errorMessage }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('shows + ADD MOVIE button only for admin users', async () => {
    const store = createTestStore(initialState);
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText('+ ADD MOVIE')).toBeInTheDocument();
  });
});