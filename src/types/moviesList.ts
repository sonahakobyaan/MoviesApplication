import type { Movie } from "@/types";

export type MoviesListProps = {
  movies: Movie[];
  total: number;
  loading: boolean;
  error?: string | null;
  onGenreSelect?: (genre: string) => void;
  selectedGenre?: string;
  isAdmin?: boolean;
}