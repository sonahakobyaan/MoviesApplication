import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Input from "@/components/common/Input/Input";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  handleKeyPress,
  handleSearch,
}) => {
  return (
    <Box
      sx={{
        padding: "60px 40px 120px 40px",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: "var(--primary-white, #FFFFFF)",
          fontWeight: 300,
          fontSize: "40px",
          letterSpacing: "1px",
          marginBottom: "38px",
        }}
      >
        FIND YOUR MOVIE
      </Typography>

      <Box sx={{ display: "flex", width: "100%", gap: "14px", height: "56px" }}>
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyDown={handleKeyPress}
          placeholder="What do you want to watch?"
          sx={{
            height: "56px",
            "& .MuiInputBase-root": {
              backgroundColor: "rgba(50, 50, 50, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(70, 70, 70, 0.9)",
              },
              "&.Mui-focused": {
                backgroundColor: "rgba(50, 50, 50, 0.9)",
              },
            },
          }}
        />

        <Button
          onClick={handleSearch}
          disableElevation
          sx={{
            backgroundColor: "var(--primary-coral, #F65261)",
            borderRadius: "4px",
            height: "56px",
            width: "233px",
            color: "var(--primary-white, #FFFFFF)",
            fontSize: "20px",
            fontWeight: 500,
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#e04855",
            },
          }}
        >
          SEARCH
        </Button>
      </Box>
    </Box>
  );
};

export default SearchSection;
