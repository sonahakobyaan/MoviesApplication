import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";

import App from "@/App";
import { store } from "@/store";
import { getUserThunk } from "@/store/thunks/userThunks";

import "@/index.css";

try {
  const token = localStorage.getItem("token");
  if (token) {
    store.dispatch(getUserThunk(token));
  }
} catch {
  // ignore localStorage errors
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
