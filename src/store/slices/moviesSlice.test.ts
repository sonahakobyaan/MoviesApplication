import { describe, it, expect } from "vitest";
import moviesReducer, { clearError, clearSelectedMovie } from "@/store/slices/moviesSlice";
import type { MoviesState } from "@/types/movies";

describe("moviesSlice", () => {
  const initialState: MoviesState = {
    movies: [],
    total: 0,
    loading: false,
    error: null,
    selectedMovie: null,
    selectedMovieLoading: false,
  };

  describe("reducers", () => {
    it("should return the initial state", () => {
      expect(moviesReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("clearError should set error to null", () => {
      const stateWithError: MoviesState = {
        ...initialState,
        error: "Some error",
      };
      const result = moviesReducer(stateWithError, clearError());
      expect(result.error).toBeNull();
    });

    it("clearSelectedMovie should set selectedMovie to null", () => {
      const stateWithMovie: MoviesState = {
        ...initialState,
        selectedMovie: {
          id: 1,
          title: "Test",
          release_date: "2024-01-01",
          poster_path: "",
          overview: "",
          genres: [],
          runtime: 120,
        },
      };
      const result = moviesReducer(stateWithMovie, clearSelectedMovie());
      expect(result.selectedMovie).toBeNull();
    });
  });

  describe("fetchMoviesThunk", () => {
    it("pending should set loading to true and error to null", () => {
      const action = { type: "movies/fetchAll/pending" };
      const result = moviesReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it("fulfilled should set loading to false and update movies", () => {
      const action = {
        type: "movies/fetchAll/fulfilled",
        payload: {
          data: [{ id: 1, title: "Movie 1", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 }],
          total: 1,
        },
      };
      const result = moviesReducer({ ...initialState, loading: true }, action);
      expect(result.loading).toBe(false);
      expect(result.movies).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("fulfilled should use filteredCount when available", () => {
      const action = {
        type: "movies/fetchAll/fulfilled",
        payload: {
          data: [{ id: 1, title: "Movie 1", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 }],
          filteredCount: 5,
          total: 10,
        },
      };
      const result = moviesReducer({ ...initialState, loading: true }, action);
      expect(result.total).toBe(5);
    });

    it("rejected should set loading to false and set error", () => {
      const action = {
        type: "movies/fetchAll/rejected",
        payload: "Failed to fetch movies",
      };
      const result = moviesReducer({ ...initialState, loading: true }, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe("Failed to fetch movies");
    });
  });

  describe("addMovieThunk", () => {
    it("pending should set loading to true and error to null", () => {
      const action = { type: "movies/add/pending" };
      const result = moviesReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it("fulfilled should push movie to array and increment total", () => {
      const newMovie = { id: 1, title: "New Movie", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 };
      const action = {
        type: "movies/add/fulfilled",
        payload: newMovie,
      };
      const result = moviesReducer(initialState, action);
      expect(result.loading).toBe(false);
      expect(result.movies).toHaveLength(1);
      expect(result.movies[0]).toEqual(newMovie);
      expect(result.total).toBe(1);
    });

    it("rejected should set loading to false and set error", () => {
      const action = {
        type: "movies/add/rejected",
        payload: "Failed to add movie",
      };
      const result = moviesReducer({ ...initialState, loading: true }, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe("Failed to add movie");
    });
  });

  describe("updateMovieThunk", () => {
    it("pending should set loading to true and error to null", () => {
      const action = { type: "movies/update/pending" };
      const result = moviesReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it("fulfilled should update existing movie in array", () => {
      const existingState: MoviesState = {
        ...initialState,
        movies: [
          { id: 1, title: "Old Title", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 },
        ],
        total: 1,
      };
      const updatedMovie = { id: 1, title: "New Title", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 150 };
      const action = {
        type: "movies/update/fulfilled",
        payload: updatedMovie,
      };
      const result = moviesReducer(existingState, action);
      expect(result.loading).toBe(false);
      expect(result.movies[0].title).toBe("New Title");
      expect(result.movies[0].runtime).toBe(150);
    });

    it("rejected should set loading to false and set error", () => {
      const action = {
        type: "movies/update/rejected",
        payload: "Failed to update movie",
      };
      const result = moviesReducer({ ...initialState, loading: true }, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe("Failed to update movie");
    });
  });

  describe("deleteMovieThunk", () => {
    it("pending should set loading to true and error to null", () => {
      const action = { type: "movies/delete/pending" };
      const result = moviesReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it("fulfilled should remove movie from array and decrement total", () => {
      const existingState: MoviesState = {
        ...initialState,
        movies: [
          { id: 1, title: "Movie 1", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 },
          { id: 2, title: "Movie 2", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 },
        ],
        total: 2,
      };
      const action = {
        type: "movies/delete/fulfilled",
        payload: 1,
      };
      const result = moviesReducer(existingState, action);
      expect(result.loading).toBe(false);
      expect(result.movies).toHaveLength(1);
      expect(result.movies[0].id).toBe(2);
      expect(result.total).toBe(1);
    });

    it("rejected should set loading to false and set error", () => {
      const action = {
        type: "movies/delete/rejected",
        payload: "Failed to delete movie",
      };
      const result = moviesReducer({ ...initialState, loading: true }, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe("Failed to delete movie");
    });
  });

  describe("fetchMovieByIdThunk", () => {
    it("pending should set selectedMovieLoading to true and selectedMovie to null", () => {
      const action = { type: "movies/fetchById/pending" };
      const result = moviesReducer(initialState, action);
      expect(result.selectedMovieLoading).toBe(true);
      expect(result.selectedMovie).toBeNull();
    });

    it("fulfilled should set selectedMovieLoading to false and set selectedMovie", () => {
      const movie = { id: 1, title: "Test Movie", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 };
      const action = {
        type: "movies/fetchById/fulfilled",
        payload: movie,
      };
      const result = moviesReducer({ ...initialState, selectedMovieLoading: true }, action);
      expect(result.selectedMovieLoading).toBe(false);
      expect(result.selectedMovie).toEqual(movie);
    });

    it("rejected should set selectedMovieLoading to false and selectedMovie to null", () => {
      const action = { type: "movies/fetchById/rejected" };
      const result = moviesReducer({ ...initialState, selectedMovieLoading: true }, action);
      expect(result.selectedMovieLoading).toBe(false);
      expect(result.selectedMovie).toBeNull();
    });
  });
});

