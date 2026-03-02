import { describe, it, expect } from "vitest";
import type { RootState } from "@/store";
import {
  selectMovies,
  selectMoviesTotal,
  selectMoviesLoading,
  selectMoviesError,
  selectSelectedMovie,
  selectSelectedMovieLoading,
  selectIsAdmin,
} from "@/store/selectors";

describe("moviesSelectors", () => {
  const createState = (moviesState: Partial<RootState["movies"]> = {}): RootState => ({
    movies: {
      movies: [],
      total: 0,
      loading: false,
      error: null,
      selectedMovie: null,
      selectedMovieLoading: false,
      ...moviesState,
    },
    user: {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    },
  });

  describe("selectMovies", () => {
    it("should return movies array", () => {
      const movies = [{ id: 1, title: "Test", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 }];
      const state = createState({ movies });
      expect(selectMovies(state)).toEqual(movies);
    });

    it("should return empty array when no movies", () => {
      const state = createState();
      expect(selectMovies(state)).toEqual([]);
    });
  });

  describe("selectMoviesTotal", () => {
    it("should return total count", () => {
      const state = createState({ total: 10 });
      expect(selectMoviesTotal(state)).toBe(10);
    });

    it("should return 0 when no total", () => {
      const state = createState();
      expect(selectMoviesTotal(state)).toBe(0);
    });
  });

  describe("selectMoviesLoading", () => {
    it("should return loading state", () => {
      const state = createState({ loading: true });
      expect(selectMoviesLoading(state)).toBe(true);
    });

    it("should return false when not loading", () => {
      const state = createState({ loading: false });
      expect(selectMoviesLoading(state)).toBe(false);
    });
  });

  describe("selectMoviesError", () => {
    it("should return error message", () => {
      const state = createState({ error: "Error message" });
      expect(selectMoviesError(state)).toBe("Error message");
    });

    it("should return null when no error", () => {
      const state = createState({ error: null });
      expect(selectMoviesError(state)).toBeNull();
    });
  });

  describe("selectSelectedMovie", () => {
    it("should return selected movie", () => {
      const movie = { id: 1, title: "Test", release_date: "2024-01-01", poster_path: "", overview: "", genres: [], runtime: 120 };
      const state = createState({ selectedMovie: movie });
      expect(selectSelectedMovie(state)).toEqual(movie);
    });

    it("should return null when no selected movie", () => {
      const state = createState({ selectedMovie: null });
      expect(selectSelectedMovie(state)).toBeNull();
    });
  });

  describe("selectSelectedMovieLoading", () => {
    it("should return selectedMovieLoading state", () => {
      const state = createState({ selectedMovieLoading: true });
      expect(selectSelectedMovieLoading(state)).toBe(true);
    });

    it("should return false when not loading", () => {
      const state = createState({ selectedMovieLoading: false });
      expect(selectSelectedMovieLoading(state)).toBe(false);
    });
  });
});

describe("userSelectors", () => {
  const createState = (userState: Partial<RootState["user"]> = {}): RootState => ({
    movies: {
      movies: [],
      total: 0,
      loading: false,
      error: null,
      selectedMovie: null,
      selectedMovieLoading: false,
    },
    user: {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      ...userState,
    },
  });

  describe("selectIsAdmin", () => {
    it("should return true when user is admin", () => {
      const state = createState({
        user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" },
        isAuthenticated: true,
      });
      expect(selectIsAdmin(state)).toBe(true);
    });

    it("should return false when user is not admin", () => {
      const state = createState({
        user: { id: 1, name: "User", email: "user@test.com", role: "user" },
        isAuthenticated: true,
      });
      expect(selectIsAdmin(state)).toBe(false);
    });

    it("should return false when user is null", () => {
      const state = createState({ user: null, isAuthenticated: false });
      expect(selectIsAdmin(state)).toBe(false);
    });
  });
});

