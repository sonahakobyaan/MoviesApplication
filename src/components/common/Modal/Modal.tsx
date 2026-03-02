import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import type { ModalProps } from "@/types/modal";

function Modal({ open, onClose, children, maxWidth = "sm" }: ModalProps) {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          backgroundColor: "var(--primary-black)",
          backgroundImage: "none",
          borderRadius: "8px",
          minHeight: "200px",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          padding: "24px",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: "12px",
            top: "12px",
            color: "var(--primary-white)",
            "&:hover": {
              color: "var(--primary-coral)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </Box>
    </Dialog>
  );
}

export default Modal;
