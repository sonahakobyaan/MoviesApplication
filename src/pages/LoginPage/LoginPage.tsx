import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import UserForm from "@/components/UserForm/UserForm";

import { loginThunk } from "@/store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";


function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);

  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        navigate(from, { replace: true });
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
    }
  }, [navigate, from]);

  const handleSubmit = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      await dispatch(loginThunk(credentials)).unwrap();
      navigate(from, { replace: true });
    } catch (_err) {
      console.error("Login failed:", _err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--primary-black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <Box
        sx={{
          fontSize: "32px",
          fontWeight: 400,
          color: "var(--primary-white)",
          marginBottom: "40px",
          cursor: "pointer",
          "& span": {
            fontWeight: 700,
            color: "var(--primary-coral)",
          },
        }}
        onClick={() => navigate("/")}
      >
        <div className="logo-text" aria-hidden="false">
            <span>netflix</span>
            <span>roulette</span>
          </div>      </Box>

      <UserForm onSubmit={handleSubmit} isLoading={loading} error={error} />
    </Box>
  );
}

export default LoginPage;
