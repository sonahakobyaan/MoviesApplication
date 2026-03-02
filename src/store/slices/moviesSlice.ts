import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMoviesThunk,
  addMovieThunk,
  updateMovieThunk,
  deleteMovieThunk,
  fetchMovieByIdThunk,
} from "@/store/thunks/movieThunks";
import type { Movie } from "@/types";
import type { MoviesState } from "@/types/movies";

const initialState: MoviesState = {
  movies: [],
  total: 0,
  loading: false,
  error: null,
  selectedMovie: null,
  selectedMovieLoading: false,
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.data;
        state.total = action.payload.filteredCount ?? action.payload.total ?? 0;
      })
      .addCase(fetchMoviesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMovieThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovieThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.push(action.payload);
        state.total += 1;
      })
      .addCase(addMovieThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMovieThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovieThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movies.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
      })
      .addCase(updateMovieThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMovieThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovieThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = state.movies.filter((m) => m.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteMovieThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMovieByIdThunk.pending, (state) => {
        state.selectedMovieLoading = true;
        state.selectedMovie = null;
      })
      .addCase(fetchMovieByIdThunk.fulfilled, (state, action) => {
        state.selectedMovieLoading = false;
        state.selectedMovie = action.payload as Movie;
      })
      .addCase(fetchMovieByIdThunk.rejected, (state) => {
        state.selectedMovieLoading = false;
        state.selectedMovie = null;
      });
  },
});

export const { clearError, clearSelectedMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
