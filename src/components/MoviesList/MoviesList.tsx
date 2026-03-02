import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import type { Movie } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import Modal from "@/components/common/Modal/Modal";
import { AVAILABLE_GENRES } from "@/utils/constants";
import Button from "@/components/common/Button/Button";
import type { MoviesListProps } from "@/types/moviesList";
import { deleteMovieThunk } from "@/store/thunks/movieThunks";

function MoviesList({
  error,
  total,
  movies,
  loading,
  onGenreSelect,
  isAdmin = false,
  selectedGenre = "ALL",
}: MoviesListProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const genres = ["ALL", ...AVAILABLE_GENRES];

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    movie: Movie
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMovie(movie);
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom,
      left: rect.left - 100,
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPosition(null);
  };

  const handleEdit = () => {
    if (selectedMovie?.id) {
      navigate(`/${selectedMovie.id}/edit-movie`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedMovie?.id) {
      try {
        await dispatch(deleteMovieThunk(selectedMovie.id)).unwrap();
        setShowDeleteModal(false);
        setSelectedMovie(null);
      } catch {
        // Error handled by slice
      }
    }
  };

  const handleMovieClick = (movie: Movie) => {
    if (movie.id) {
      navigate(`/${movie.id}`);
    }
  };

  const getYearFromDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("-")[0];
  };

  const movieCountText =
    total === 1 ? "1 movie found" : `${total} movies found`;

  if (loading) {
    return (
      <Box sx={{ padding: "40px", textAlign: "center" }}>
        <Typography sx={{ color: "var(--primary-white)" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: "40px", textAlign: "center" }}>
        <Typography sx={{ color: "var(--primary-coral)" }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "var(--primary-black)",
        minHeight: "100vh",
        padding: "0 40px 40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          padding: "20px 0",
          flexWrap: "wrap",
        }}
      >
        {genres.map((genre) => {
          const filterValue = genre === "ALL" ? "" : genre;
          const isSelected =
            selectedGenre === genre ||
            (selectedGenre === "" && genre === "ALL");
          return (
            <Typography
              key={genre}
              onClick={() => onGenreSelect?.(filterValue || "ALL")}
              sx={{
                color: "var(--primary-white)",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: isSelected ? 600 : 400,
                borderBottom: isSelected
                  ? "2px solid var(--primary-coral)"
                  : "2px solid transparent",
                paddingBottom: "4px",
                transition: "all 0.2s",
                "&:hover": {
                  color: "var(--primary-coral)",
                },
              }}
            >
              {genre}
            </Typography>
          );
        })}
      </Box>

      <Typography sx={{ color: "var(--primary-white)", marginBottom: "20px" }}>
        {movieCountText}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "32px",
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie.id}
            onClick={() => handleMovieClick(movie)}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              cursor: "pointer",
              position: "relative",
              "&:hover": {
                "& .movie-overlay": {
                  opacity: 1,
                },
                "& .movie-menu": {
                  opacity: 1,
                },
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                image={movie.poster_path}
                alt={movie.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg";
                }}
                sx={{
                  height: "330px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <Box
                className="movie-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  borderRadius: "4px",
                }}
              />
              {isAdmin && (
                <IconButton
                  className="movie-menu"
                  onClick={(e) => handleMenuOpen(e, movie)}
                  sx={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    color: "var(--primary-white)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            <Box sx={{ padding: "8px 0" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--primary-white)",
                    fontWeight: 300,
                    fontSize: "14px",
                    flex: 1,
                  }}
                >
                  {movie.title}
                </Typography>
                <Box
                  sx={{
                    border: "1px solid var(--primary-white)",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "12px",
                    color: "var(--primary-white)",
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getYearFromDate(movie.release_date)}
                </Box>
              </Box>
              <Typography
                sx={{
                  color: "var(--secondary-gray)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {movie.genres?.join(", ")}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition || undefined}
        PaperProps={{
          sx: {
            backgroundColor: "var(--primary-black)",
            border: "1px solid var(--primary-gray)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            color: "var(--primary-coral)",
            "&:hover": {
              backgroundColor: "rgba(246, 82, 97, 0.1)",
            },
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            color: "var(--primary-coral)",
            "&:hover": {
              backgroundColor: "rgba(246, 82, 97, 0.1)",
            },
          }}
        >
          Delete
        </MenuItem>
      </Menu>

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

export default MoviesList;
