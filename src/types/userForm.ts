export type UserFormProps = {
    onSubmit: (credentials: { email: string; password: string }) => void;
    isLoading?: boolean;
    error?: string | null;
  }