import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import {
  selectIsAdmin,
  selectSelectedMovie,
  selectSelectedMovieLoading,
} from "@/store/selectors";
import {
  fetchMovieByIdThunk,
  deleteMovieThunk,
} from "@/store/thunks/movieThunks";
import Header from "@/components/Header/Header";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function MoviePage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(selectIsAdmin);
  const movie = useAppSelector(selectSelectedMovie);
  const isLoading = useAppSelector(selectSelectedMovieLoading);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieByIdThunk(movieId));
    }
  }, [dispatch, movieId]);

  const handleBackToSearch = () => {
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/${movieId}/edit-movie`);
  };

  const handleDeleteConfirm = async () => {
    if (!movieId) return;
    try {
      await dispatch(deleteMovieThunk(parseInt(movieId))).unwrap();
      setShowDeleteModal(false);
      navigate("/");
    } catch {
      // Error handled by slice
    }
  };

  const getYearFromDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("-")[0];
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (!movieId) {
    return null;
  }

  if (isLoading) {
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

  if (!movie) {
    return (
      <Box sx={{ backgroundColor: "var(--primary-black)", minHeight: "100vh" }}>
        <Header />
        <Box sx={{ padding: "40px", textAlign: "center" }}>
          <Typography sx={{ color: "var(--primary-white)" }}>
            Movie not found
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "var(--primary-black)" }}>
      <Header />

      <Box
        sx={{
          backgroundColor: "var(--primary-black)",
          padding: "40px",
          display: "flex",
          gap: "40px",
        }}
      >
        <Box
          component="img"
          src={movie?.poster_path}
          alt={movie?.title}
          sx={{
            width: "300px",
            height: "450px",
            objectFit: "cover",
            borderRadius: "4px",
            border: "2px solid var(--primary-coral)",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg";
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "8px",
            }}
          >
            <Button
              text="GO BACK"
              variant="secondary"
              onClick={handleBackToSearch}
              sx={{
                marginRight: "16px",
                backgroundColor: "#555555",
                color: "#FFFFFF",
                borderColor: "#555555",
              }}
            />
            <Typography
              variant="h3"
              sx={{
                color: "var(--primary-white)",
                fontWeight: 400,
              }}
            >
              {movie?.title?.toUpperCase()}
            </Typography>
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "2px solid var(--primary-white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-white)",
                fontWeight: 600,
                fontSize: "16px",
                backgroundColor: "#555555",
              }}
            >
              {movie?.vote_average?.toFixed(1)}
            </Box>
          </Box>

          <Typography
            sx={{
              color: "var(--secondary-gray)",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {movie?.genres?.join(", ")}
          </Typography>

          <Box sx={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
            <Typography sx={{ color: "var(--primary-coral)", fontWeight: 600 }}>
              {getYearFromDate(movie?.release_date || "")}
            </Typography>
            <Typography sx={{ color: "var(--primary-coral)", fontWeight: 600 }}>
              {formatRuntime(movie?.runtime || 0)}
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "var(--primary-white)",
              lineHeight: 1.6,
              maxWidth: "600px",
            }}
          >
            {movie?.overview}
          </Typography>

          {isAdmin && (
            <Box sx={{ display: "flex", gap: "16px", marginTop: "40px" }}>
              <Button
                text="DELETE"
                variant="secondary"
                onClick={() => setShowDeleteModal(true)}
                sx={{
                  backgroundColor: "#555555",
                  color: "#FFFFFF",
                  borderColor: "#555555",
                }}
              />
              <Button
                text="EDIT"
                variant="secondary"
                onClick={handleEdit}
                sx={{
                  backgroundColor: "#555555",
                  color: "#FFFFFF",
                  borderColor: "#555555",
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ textAlign: "center", padding: "20px" }}>
          <Typography
            variant="h5"
            sx={{
              color: "var(--primary-white)",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            DELETE MOVIE
          </Typography>
          <Typography
            sx={{ color: "var(--primary-white)", marginBottom: "32px" }}
          >
            Are you sure you want to delete this movie?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <Button
              text="CANCEL"
              variant="outlined"
              onClick={() => setShowDeleteModal(false)}
            />
            <Button
              text="CONFIRM"
              variant="primary"
              onClick={handleDeleteConfirm}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default MoviePage;
