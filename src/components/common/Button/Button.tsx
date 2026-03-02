import ButtonMUI from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import type { ButtonProps } from "@/types/button";
import { getVariant, getColor } from "@/hooks/buttonHooks.ts";

function Button({
  text,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  isLoading = false,
  sx = {},
}: ButtonProps) {
  return (
    <ButtonMUI
      type={type}
      onClick={onClick}
      variant={getVariant(variant)}
      disabled={disabled || isLoading}
      color={getColor(variant) as "primary" | "secondary" | "inherit"}
      sx={{
        ...(variant === "primary" && {
          backgroundColor: "var(--primary-coral)",
          color: "var(--primary-white)",
          borderColor: "var(--primary-coral)",
          "&:hover": {
            backgroundColor: "#e04855",
            borderColor: "#e04855",
          },
        }),
        ...(variant === "secondary" && {
          backgroundColor: "var(--primary-gray)",
          color: "var(--primary-coral)",
          borderColor: "var(--primary-gray)",
          "&:hover": {
            backgroundColor: "var(--secondary-gray)",
            borderColor: "var(--secondary-gray)",
          },
        }),
        ...(variant === "outlined" && {
          backgroundColor: "transparent",
          color: "var(--primary-coral)",
          borderColor: "var(--primary-coral)",
          "&:hover": {
            backgroundColor: "rgba(246, 82, 97, 0.1)",
            borderColor: "var(--primary-coral)",
          },
        }),
        textTransform: "uppercase",
        fontWeight: 600,
        padding: "8px 24px",
        borderRadius: "4px",
        "&:disabled": {
          opacity: 0.5,
        },
        ...sx,
      }}
    >
      {isLoading ? (
        <CircularProgress size={20} sx={{ color: "var(--primary-white)" }} />
      ) : (
        text
      )}
    </ButtonMUI>
  );
}

export default Button;
