import React, { useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Input from "@/components/common/Input/Input";
import type { UserFormProps } from "@/types/userForm";
import Button from "@/components/common/Button/Button";

function UserForm({ onSubmit, isLoading = false, error: serverError }: UserFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "EMAIL is required";
    }
    if (!password.trim()) {
      newErrors.password = "PASSWORD is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password });
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setErrors({});
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: "var(--primary-black)",
        padding: "40px",
        borderRadius: "8px",
        minWidth: "400px",
        margin: "0 auto",
        width: "40%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "var(--primary-white)",
          mb: 4,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        LOGIN
      </Typography>

      {serverError && (
        <Typography
          sx={{ color: "var(--primary-coral)", mb: 2, textAlign: "center" }}
        >
          {serverError}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Input
          label="EMAIL"
          value={email}
          onChange={(val) => {
            setEmail(val);
            if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
          }}
          type="email"
          placeholder="enter email"
          error={errors.email}
        />

        <Input
          label="PASSWORD"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
          }}
          type="password"
          placeholder="enter password"
          error={errors.password}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "16px", mt: 2 }}>
          <Button text="RESET" variant="outlined" onClick={handleReset} />
          <Button text="LOGIN" variant="primary" type="submit" disabled={isLoading} />
        </Box>
      </Box>
    </Box>
  );
}

export default UserForm;