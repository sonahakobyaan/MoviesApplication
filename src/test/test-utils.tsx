import { Provider } from "react-redux";
import React, { type ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";

import userReducer from "@/store/slices/userSlice";
import moviesReducer from "@/store/slices/moviesSlice";

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        user: userReducer,
        movies: moviesReducer,
      },
      preloadedState: preloadedState as object,
    }),
    ...renderOptions
  }: {
    preloadedState?: Record<string, unknown>;
    store?: ReturnType<typeof configureStore>;
  } & Omit<RenderOptions, "wrapper"> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
