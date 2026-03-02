import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import {
  selectSelectedMovie,
  selectSelectedMovieLoading,
} from "@/store/selectors";
import {
  addMovieThunk,
  updateMovieThunk,
  fetchMovieByIdThunk,
} from "@/store/thunks/movieThunks";
import type { Movie } from "@/types";
import Modal from "@/components/common/Modal/Modal";
import MovieForm from "@/components/MovieForm/MovieForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";


function ManageMoviePage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const movie = useAppSelector(selectSelectedMovie);
  const loadingMovie = useAppSelector(selectSelectedMovieLoading);
  const { loading } = useAppSelector((state) => state.movies);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isEditMode = Boolean(movieId);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieByIdThunk(movieId));
    }
  }, [dispatch, movieId]);

  const handleSubmit = async (formData: Movie) => {
    try {
      if (isEditMode && movieId) {
        await dispatch(
          updateMovieThunk({ ...formData, id: parseInt(movieId) })
        ).unwrap();
      } else {
        await dispatch(addMovieThunk(formData)).unwrap();
      }
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch {
      // Error handled by slice
    }
  };

  const handleReset = () => {
    // Reset is handled by MovieForm internally
  };

  if (isEditMode && loadingMovie) {
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

  if (isEditMode && movieId && !movie) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "var(--primary-black)",
          padding: "40px",
        }}
      >
        <Typography sx={{ color: "var(--primary-white)" }}>
          Movie not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--primary-black)",
        padding: "40px 0",
      }}
    >
      <Box
        onClick={() => navigate("/")}
        sx={{
          cursor: "pointer",
          fontSize: "24px",
          fontWeight: 400,
          color: "var(--primary-white)",
          padding: "0 40px",
          marginBottom: "40px",
          "& span": {
            fontWeight: 700,
            color: "var(--primary-coral)",
          },
        }}
      >
        <div className="logo-text" aria-hidden="false">
            <span>netflix</span>
            <span>roulette</span>
          </div>      </Box>

      <MovieForm
        movie={isEditMode ? movie ?? undefined : undefined}
        onSubmit={handleSubmit}
        onReset={handleReset}
        isLoading={loading}
        mode={isEditMode ? "edit" : "add"}
      />

      <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <Box sx={{ textAlign: "center", padding: "40px" }}>
          <Box
            sx={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-coral)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Typography
              sx={{ color: "var(--primary-white)", fontSize: "30px" }}
            >
              ✓
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: "var(--primary-white)",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            CONGRATULATIONS!
          </Typography>
          <Typography sx={{ color: "var(--secondary-gray)" }}>
            The movie has been{" "}
            {isEditMode
              ? "updated in database successfully"
              : "added to database successfully"}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default ManageMoviePage;
