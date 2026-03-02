import TextField from "@mui/material/TextField";

import type { InputProps } from "@/types/input";

function Input({
  sx,
  error,
  label,
  value,
  onChange,
  rows = 1,
  onKeyDown,
  placeholder,
  type = "text",
  required = false,
  fullWidth = true,
  multiline = false,
}: InputProps) {
  const isDateInput = type === "date";

  return (
    <TextField
      rows={rows}
      type={type}
      value={value}
      label={label}
      error={!!error}
      variant="filled"
      helperText={error}
      required={required}
      onKeyDown={onKeyDown}
      fullWidth={fullWidth}
      multiline={multiline}
      placeholder={isDateInput ? "mm/dd/yyyy" : placeholder}
      onChange={(e) => onChange(e.target.value)}
      InputLabelProps={{
        shrink: isDateInput ? true : undefined,
        sx: {
          color: "var(--primary-coral, #F65261)",
          "&.Mui-focused": {
            color: "var(--primary-coral, #F65261)",
          },
        },
      }}
      InputProps={{
        disableUnderline: true,
        sx: {
          backgroundColor: "var(--primary-gray, #424242)",
          color: "var(--primary-white, #FFFFFF)",
          borderRadius: "4px",
          height: "100%",
          "&:hover": {
            backgroundColor: "var(--secondary-gray, #555555)",
          },
          "&.Mui-focused": {
            backgroundColor: "var(--primary-gray, #424242)",
          },
          "& .MuiFilledInput-input": {
            color: "var(--primary-white, #FFFFFF)",
            paddingTop: label ? "25px" : "16px",
            paddingBottom: label ? "8px" : "16px",
          },
          "& .MuiFilledInput-input::placeholder": {
            color: "rgba(255, 255, 255, 0.3)",
            opacity: 1,
          },
        },
      }}
      FormHelperTextProps={{
        sx: {
          color: "var(--primary-coral, #F65261)",
          marginLeft: 0,
        },
      }}
      sx={{
        ...sx,
      }}
    />
  );
}

export default Input;
