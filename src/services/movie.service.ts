import api from '@/services/api';
import type { Movie, MoviesResponse, MovieQueryParams } from '@/types';

export const MovieService = {
  getMovies: async (params?: MovieQueryParams) => {
    const response = await api.get<MoviesResponse>('/movies', { params });
    return response.data;
  },

  getMovieById: async (id: string | number) => {
    const response = await api.get<{ data: Movie }>(`/movies/${id}`);
    return response.data.data;
  },

  createMovie: async (movie: Movie) => {
    const response = await api.post<{ data: Movie }>('/movies', movie);
    return response.data.data;
  },

  updateMovie: async (movie: Movie) => {
    const id = movie.id;
    if (!id) throw new Error('Movie id is required for update');
    const response = await api.put<{ data: Movie }>(`/movies/${id}`, movie);
    return response.data.data;
  },

  deleteMovie: async (id: string | number) => {
    await api.delete(`/movies/${id}`);
    return id;
  }
};