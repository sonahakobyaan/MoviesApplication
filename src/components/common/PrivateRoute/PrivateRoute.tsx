import { Navigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { useAppSelector } from "@/store/hooks";
import type { Props } from "@/types/privateRoute";

export default function PrivateRoute({ children, requiredRole }: Props) {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.user
  );
  const hasToken = Boolean(
    typeof window !== "undefined" && localStorage.getItem("token")
  );

  const isAuth = isAuthenticated || hasToken;
  const userRole = user?.role?.toLowerCase();

  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        state={{ from: { pathname: location.pathname } }}
        replace
      />
    );
  }

  if (hasToken && !user && loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--primary-black)",
        }}
      >
        <CircularProgress sx={{ color: "var(--primary-coral)" }} />
      </Box>
    );
  }

  if (requiredRole && userRole !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
