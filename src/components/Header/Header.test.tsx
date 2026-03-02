import { Provider } from "react-redux";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import Header from "@/components/Header/Header";
import userReducer from "@/store/slices/userSlice";
import moviesReducer from "@/store/slices/moviesSlice";

const createStore = (
  user: {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  } | null
) =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
    },
    preloadedState: {
      user: {
        user,
        isAuthenticated: !!user,
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

describe("Header", () => {
  it("renders logo with netflixroulette text", () => {
    const store = createStore({
      id: 1,
      name: "John",
      email: "john@test.com",
      role: "user",
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/netflix/)).toBeInTheDocument();
    expect(screen.getByText(/roulette/)).toBeInTheDocument();
  });

  it("displays + ADD MOVIE button only for admin on home route", () => {
    const store = createStore({
      id: 1,
      name: "Admin",
      email: "admin@test.com",
      role: "admin",
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: /add movie/i })
    ).toBeInTheDocument();
  });

  it("hides + ADD MOVIE button for non-admin user", () => {
    const store = createStore({
      id: 1,
      name: "John",
      email: "john@test.com",
      role: "user",
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("button", { name: /add movie/i })
    ).not.toBeInTheDocument();
  });

  it("hides + ADD MOVIE button when not on home route", () => {
    const store = createStore({
      id: 1,
      name: "Admin",
      email: "admin@test.com",
      role: "admin",
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/123"]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("button", { name: /add movie/i })
    ).not.toBeInTheDocument();
  });

  it("displays user initial in avatar", () => {
    const store = createStore({
      id: 1,
      name: "John Doe",
      email: "john@test.com",
      role: "user",
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("opens dropdown with user name and LOGOUT on avatar click", async () => {
    const user = userEvent.setup();
    const store = createStore({
      id: 1,
      name: "John",
      email: "john@test.com",
      role: "user",
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    await user.click(screen.getByText("J"));

    expect(screen.getByText("JOHN")).toBeInTheDocument();
    expect(screen.getByText("LOGOUT")).toBeInTheDocument();
  });
});
