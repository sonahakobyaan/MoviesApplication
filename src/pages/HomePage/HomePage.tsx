import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";

import {
  selectMovies,
  selectMoviesTotal,
  selectMoviesLoading,
  selectIsAdmin,
  selectMoviesError,
} from "@/store/selectors";
import Header from "@/components/Header/Header";
import MoviesList from "@/components/MoviesList/MoviesList";
import { fetchMoviesThunk } from "@/store/thunks/movieThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import SearchSection from "@/pages/HomePage/components/SearchSection";

import bg from "@/assets/BG.png";

function HomePage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const movies = useAppSelector(selectMovies);
  const total = useAppSelector(selectMoviesTotal);
  const loading = useAppSelector(selectMoviesLoading);
  const isAdmin = useAppSelector(selectIsAdmin);
  const error = useAppSelector(selectMoviesError);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("filter") || "ALL"
  );

  const handleSearch = useCallback(() => {
    const params: Record<string, string> = {};

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
      params.searchBy = "title";
    }

    if (selectedGenre && selectedGenre !== "ALL") {
      params.filter = selectedGenre;
    }

    dispatch(fetchMoviesThunk(params));
    setSearchParams(params, { replace: true });
  }, [dispatch, searchQuery, selectedGenre, setSearchParams]);

  useEffect(() => {
    handleSearch();
  }, [selectedGenre]); 

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre || "ALL");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#232323" }}>
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "396px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleKeyPress={handleKeyPress}
          handleSearch={handleSearch}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: "var(--primary-gray, #555555)",
          height: "10px",
        }}
      />

      <MoviesList
        movies={movies}
        total={total}
        loading={loading}
        error={error}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
        isAdmin={isAdmin}
      />

      <Box
        sx={{
          backgroundColor: "var(--primary-gray, #424242)",
          height: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="logo-text" aria-hidden="false">
          <span style={{ color: "#F65261", fontWeight: "900" }}>netflix</span>
          <span style={{ color: "#F65261", fontWeight: "100" }}>roulette</span>
        </div>
      </Box>
    </Box>
  );
}

export default HomePage;