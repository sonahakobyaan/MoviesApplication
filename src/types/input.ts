import type { SxProps, Theme } from '@mui/material/styles';

export type InputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'url';
  placeholder?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  sx?: SxProps<Theme>;
}