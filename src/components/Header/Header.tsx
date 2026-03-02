import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { logout } from "@/store/slices/userSlice";
import Button from "@/components/common/Button/Button";
import { selectUser, selectIsAdmin } from "@/store/selectors";
import { useAppSelector, useAppDispatch } from "@/store/hooks";


function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isOnHomePage = location.pathname === "/";
  const showAddMovieButton = isAdmin && isOnHomePage;

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/login");
  };

  const handleAddMovie = () => {
    navigate("/create-movie");
  };

  const userInitial = user?.name
    ? user.name.split(" ")[0].charAt(0).toUpperCase()
    : "?";
  const userFullName = user?.name ? user.name.toUpperCase() : "USER";

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
      }}
    >
      <Box
        onClick={handleLogoClick}
        sx={{
          cursor: "pointer",
          fontSize: "24px",
          fontWeight: 400,
          color: "#FFFFFF",
          "& span": {
            fontWeight: 700,
            color: "#F65261",
          },
        }}
      >
        <div className="logo-text" aria-hidden="false">
            <span>netflix</span>
            <span>roulette</span>
          </div>      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {showAddMovieButton && (
          <Button
            text="+ ADD MOVIE"
            variant="secondary"
            onClick={handleAddMovie}
            sx={{
              backgroundColor: "#424242",
              color: "#F65261",
              "&:hover": {
                backgroundColor: "#555555",
                borderColor: "#F65261",
              },
            }}
          />
        )}

        <Box
          onClick={handleAvatarClick}
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#424242",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F65261",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "#555555",
            },
          }}
        >
          {userInitial}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              backgroundColor: "#424242",
              color: "#FFFFFF",
              marginTop: "22px",
              minWidth: "180px",
            },
          }}
        >
          <MenuItem
            disabled
            sx={{
              color: "#FFFFFF",
              fontWeight: 300,
              cursor: "default",
              opacity: 1,
            }}
          >
            {userFullName}
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: "var(--primary-coral)",
              fontWeight: 300,
              "&:hover": {
                backgroundColor: "var(--primary-coral)",
                color: "#FFFFFF",
              },
            }}
          >
            LOGOUT
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default Header;
