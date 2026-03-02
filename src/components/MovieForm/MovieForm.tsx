import React, { useState } from "react";

import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";

import type { Movie } from "@/types";
import Input from "@/components/common/Input/Input";
import { AVAILABLE_GENRES } from "@/utils/constants";
import Button from "@/components/common/Button/Button";
import type { MovieFormProps } from "@/types/movieForm";

const GENRES = AVAILABLE_GENRES;

const initialMovieState: Movie = {
  title: "",
  release_date: "",
  poster_path: "",
  vote_average: 0,
  genres: [],
  runtime: 0,
  overview: "",
};

function MovieForm({
  mode,
  movie,
  onReset,
  onSubmit,
  isLoading = false,
}: MovieFormProps) {
  const [formData, setFormData] = useState<Movie>(movie || initialMovieState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.release_date) newErrors.release_date = "Release date is required";
    if (!formData.poster_path?.trim()) newErrors.poster_path = "Poster URL is required";
    if (!formData.genres?.length) newErrors.genres = "Select at least one genre to proceed";
    if (!formData.overview?.trim()) newErrors.overview = "Overview is required";
    

    const rating = formData.vote_average ?? 0;
    if (formData.vote_average !== undefined && formData.vote_average !== null && (rating < 0 || rating > 10)) {
      newErrors.vote_average = "Rating must be between 0 and 10";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...newErrors, _general: "ALL FIELDS ARE REQUIRED" });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData(movie || initialMovieState);
    setErrors({});
    onReset();
  };

  const handleChange = (
    field: keyof Movie,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors._general) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        delete newErrs._general;
        return newErrs;
      });
    }
  };

  const handleRatingChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= 10)) {
      handleChange("vote_average", numValue || 0);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: "var(--primary-black)",
        padding: "40px",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "var(--primary-white)",
          marginBottom: "32px",
          textTransform: "uppercase",
        }}
      >
        {mode === "add" ? "ADD MOVIE" : "EDIT MOVIE"}
      </Typography>

      {errors._general && (
        <Typography
          role="alert"
          sx={{
            color: "var(--primary-coral)",
            marginBottom: "16px",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {errors._general}
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: "24px",
        }}
      >
        <Box>
          <Input
            label="TITLE"
            value={formData.title}
            onChange={(value) => handleChange("title", value)}
            placeholder="Title"
            error={errors.title}
          />
        </Box>

        <Box>
          <Input
            label="RELEASE DATE"
            type="date"
            value={formData.release_date}
            onChange={(value) => handleChange("release_date", value)}
            error={errors.release_date}
          />
        </Box>

        <Box>
          <Input
            label="POSTER URL"
            type="url"
            value={formData.poster_path}
            onChange={(value) => handleChange("poster_path", value)}
            placeholder="Poster URL"
            error={errors.poster_path}
          />
        </Box>

        <Box>
          <Input
            label="RATING"
            type="number"
            value={formData.vote_average?.toString() || ""}
            onChange={handleRatingChange}
            placeholder="Rating (0-10)"
            error={errors.vote_average}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              color: "var(--primary-coral)",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            GENRE
          </Typography>
          <FormControl fullWidth error={!!errors.genres}>
            <Select
              multiple
              value={formData.genres || []}
              onChange={(e) =>
                handleChange("genres", e.target.value as string[])
              }
              input={<OutlinedInput />}
              renderValue={(selected) => (selected.length === 0 ? "Select Genre" : selected.join(", "))}
              displayEmpty
              sx={{
                backgroundColor: "var(--primary-gray)",
                color: "var(--primary-white)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: errors.genres
                    ? "var(--primary-coral)"
                    : "transparent",
                },
              }}
            >
              {GENRES.map((genre) => (
                <MenuItem sx={{color: "var(--primary-coral)"}} key={genre} value={genre}>
                  <Checkbox sx={{color: "var(--primary-coral)"}} checked={(formData.genres || []).includes(genre)} />
                  <ListItemText primary={genre} />
                </MenuItem>
              ))}
            </Select>
            {errors.genres && (
              <FormHelperText sx={{ color: "var(--primary-coral)", ml: 0 }}>
                {errors.genres}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "end" }}>
          <Input
            label="RUNTIME (MINUTES)"
            type="number"
            value={formData.runtime?.toString() || ""}
            onChange={(value) => handleChange("runtime", parseInt(value) || 0)}
            placeholder="Runtime"
            error={errors.runtime}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
          <Input
            label="OVERVIEW"
            value={formData.overview}
            onChange={(value) => handleChange("overview", value)}
            placeholder="Overview"
            multiline
            rows={4}
            error={errors.overview}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "16px", mt: 2 }}>
        <Button text="RESET" variant="outlined" onClick={handleReset} />
        <Button text="SUBMIT" variant="primary" type="submit" disabled={isLoading} />
      </Box>
    </Box>
  );
}

export default MovieForm;

