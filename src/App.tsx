import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "@/pages/HomePage/HomePage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import MoviePage from "@/pages/MoviePage/MoviePage";
import ManageMoviePage from "@/pages/ManageMoviePage/ManageMoviePage";
import PrivateRoute from "@/components/common/PrivateRoute/PrivateRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/:movieId"
        element={
          <PrivateRoute>
            <MoviePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-movie"
        element={
          <PrivateRoute requiredRole={"admin"}>
            <ManageMoviePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/:movieId/edit-movie"
        element={
          <PrivateRoute requiredRole={"admin"}>
            <ManageMoviePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
