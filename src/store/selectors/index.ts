import type { RootState } from '@/store/index.ts';

export const selectMovies = (state: RootState) => state.movies.movies;
export const selectMoviesTotal = (state: RootState) => state.movies.total;
export const selectMoviesLoading = (state: RootState) => state.movies.loading;
export const selectMoviesError = (state: RootState) => state.movies.error;
export const selectSelectedMovie = (state: RootState) => state.movies.selectedMovie;
export const selectSelectedMovieLoading = (state: RootState) => state.movies.selectedMovieLoading;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export const selectIsAdmin = (state: RootState) => {
  const role = state.user.user?.role;
  return role?.toLowerCase() === 'admin';
};
