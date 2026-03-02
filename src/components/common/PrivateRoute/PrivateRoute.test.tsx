import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import userReducer from "@/store/slices/userSlice";
import moviesReducer from "@/store/slices/moviesSlice";
import PrivateRoute from "@/components/common/PrivateRoute/PrivateRoute";

const createStore = (userState: {
  user: {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  } | null;
  isAuthenticated: boolean;
}) =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
    },
    preloadedState: {
      user: {
        user: userState.user
          ? {
              id: userState.user.id,
              name: userState.user.name,
              email: userState.user.email,
              role: userState.user.role,
            }
          : null,
        isAuthenticated: userState.isAuthenticated,
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
    },
  });

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it("redirects to /login when user is not authenticated", () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const store = createStore({ user: null, isAuthenticated: false });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <div>Protected Content</div>
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("allows access when user is authenticated", () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("token");
    const store = createStore({
      user: { id: 1, name: "John", email: "john@test.com", role: "user" },
      isAuthenticated: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <div>Protected Content</div>
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to / when admin route is accessed by non-admin user", () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("token");
    const store = createStore({
      user: { id: 1, name: "John", email: "john@test.com", role: "user" },
      isAuthenticated: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/create-movie"]}>
          <Routes>
            <Route
              path="/create-movie"
              element={
                <PrivateRoute requiredRole="admin">
                  <div>Admin Content</div>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("allows admin user to access admin-only routes", () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("token");
    const store = createStore({
      user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" },
      isAuthenticated: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/create-movie"]}>
          <Routes>
            <Route
              path="/create-movie"
              element={
                <PrivateRoute requiredRole="admin">
                  <div>Admin Content</div>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
