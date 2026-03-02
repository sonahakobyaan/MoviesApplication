import type { Movie } from '@/types';

export type MovieFormProps = {
  movie?: Movie;
  onSubmit: (movie: Movie) => void;
  onReset: () => void;
  isLoading?: boolean;
  mode: 'add' | 'edit';
}