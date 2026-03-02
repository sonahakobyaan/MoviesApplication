import { configureStore } from "@reduxjs/toolkit";

import userReducer from "@/store/slices/userSlice.ts";
import moviesReducer from "@/store/slices/moviesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
