export const getVariant = (variant: "primary" | "secondary" | "outlined") => {
  switch (variant) {
    case "primary":
      return "contained";
    case "secondary":
    case "outlined":
      return "outlined";
    default:
      return "contained";
  }
};

export const getColor = (variant: "primary" | "secondary" | "outlined") => {
  switch (variant) {
    case "primary":
      return "primary";
    case "secondary":
    case "outlined":
      return "inherit";
    default:
      return "primary";
  }
};
