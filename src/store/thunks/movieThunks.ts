import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Movie, MovieQueryParams } from '@/types';
import { MovieService } from '@/services/movie.service';

export const fetchMoviesThunk = createAsyncThunk(
    'movies/fetchAll',
    async (params: MovieQueryParams | undefined, { rejectWithValue }) => {
      try {
        return await MovieService.getMovies(params);
      } catch {
        return rejectWithValue('Failed to fetch movies');
      }
    }
  );
  
  export const addMovieThunk = createAsyncThunk(
    'movies/add',
    async (movie: Movie, { rejectWithValue }) => {
      try {
        const response = await MovieService.createMovie(movie);
        return response;
      } catch (err: unknown) {
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add movie';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  export const updateMovieThunk = createAsyncThunk(
    'movies/update',
    async (movie: Movie, { rejectWithValue }) => {
      try {
        const response = await MovieService.updateMovie(movie);
        return response;
      } catch (err: unknown) {
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update movie';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  export const deleteMovieThunk = createAsyncThunk(
    'movies/delete',
    async (id: number, { rejectWithValue }) => {
      try {
        await MovieService.deleteMovie(id);
        return id;
      } catch {
        return rejectWithValue('Failed to delete movie');
      }
    }
  );
  
  export const fetchMovieByIdThunk = createAsyncThunk(
    'movies/fetchById',
    async (id: string | number, { rejectWithValue }) => {
      try {
        return await MovieService.getMovieById(id);
      } catch {
        return rejectWithValue('Failed to fetch movie');
      }
    }
  );