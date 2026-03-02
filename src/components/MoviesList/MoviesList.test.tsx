import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MoviesList from './MoviesList';
import userReducer from '../../store/slices/userSlice';
import moviesReducer from '../../store/slices/moviesSlice';
import type { Movie } from '../../types';

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Pulp Fiction',
    release_date: '1994-10-14',
    poster_path: 'https://example.com/poster1.jpg',
    overview: 'A movie',
    runtime: 154,
    genres: ['Crime', 'Drama'],
  },
  {
    id: 2,
    title: 'Inception',
    release_date: '2010-07-16',
    poster_path: 'https://example.com/poster2.jpg',
    overview: 'Another movie',
    runtime: 148,
    genres: ['Action', 'Sci-Fi'],
  },
];

const createStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
    },
  });

describe('MoviesList', () => {
  it('renders movie count correctly', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MoviesList
            movies={mockMovies}
            total={2}
            loading={false}
            selectedGenre="ALL"
            onGenreSelect={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('2 movies found')).toBeInTheDocument();
  });

  it('renders singular "movie found" when count is 1', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MoviesList
            movies={[mockMovies[0]]}
            total={1}
            loading={false}
            selectedGenre="ALL"
            onGenreSelect={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('1 movie found')).toBeInTheDocument();
  });

  it('renders movie tiles with title, genre, and year', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MoviesList
            movies={mockMovies}
            total={2}
            loading={false}
            selectedGenre="ALL"
            onGenreSelect={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Pulp Fiction')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Crime, Drama')).toBeInTheDocument();
    expect(screen.getByText('Action, Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('1994')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('displays genre filter buttons from movies', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MoviesList
            movies={mockMovies}
            total={2}
            loading={false}
            selectedGenre="ALL"
            onGenreSelect={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('Crime')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  it('does not show context menu button for non-admin', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MoviesList
            movies={mockMovies}
            total={2}
            loading={false}
            selectedGenre="ALL"
            onGenreSelect={vi.fn()}
            isAdmin={false}
          />
        </MemoryRouter>
      </Provider>
    );

    const menuButtons = screen.queryAllByRole('button');
    const moreVertButtons = menuButtons.filter((btn) => btn.querySelector('[data-testid="MoreVertIcon"]'));
    expect(moreVertButtons.length).toBe(0);
  });

  it('shows context menu button for admin', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MoviesList
            movies={mockMovies}
            total={2}
            loading={false}
            selectedGenre="ALL"
            onGenreSelect={vi.fn()}
            isAdmin={true}
          />
        </MemoryRouter>
      </Provider>
    );

    const iconButtons = document.querySelectorAll('.movie-menu');
    expect(iconButtons.length).toBeGreaterThan(0);
  });

  it('shows loading state', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MoviesList
            movies={[]}
            total={0}
            loading={true}
            selectedGenre="ALL"
            onGenreSelect={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
