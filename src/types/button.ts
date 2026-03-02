import type { SxProps, Theme } from '@mui/material';

export type ButtonProps = {
  text: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  sx?: SxProps<Theme>;
}