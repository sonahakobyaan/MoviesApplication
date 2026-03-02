import type { Movie } from '@/types';

export type MoviesState = {
  movies: Movie[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedMovie: Movie | null;
  selectedMovieLoading: boolean;
}