export type User = {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    token?: string;
    password?: string;
  }
  
  export type AuthResponse = {
    data: User;
    message: string;
  }
  
  export type Movie = {
    id?: number;
    title: string;
    tagline?: string;
    vote_average?: number;
    vote_count?: number;
    release_date: string;
    poster_path: string;
    overview: string;
    budget?: number;
    revenue?: number;
    runtime: number;
    genres: string[];
  }
  
  export type MoviesResponse = {
    data: Movie[];
    total?: number;
    filteredCount?: number;
    totalAmount?: number;
    offset: number;
    limit: number;
  }
  
  export type MovieQueryParams = {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    searchBy?: 'title' | 'genres';
    filter?: string;
    offset?: number;
    limit?: number;
  }