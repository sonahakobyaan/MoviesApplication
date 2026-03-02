import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

import UserForm from "@/components/UserForm/UserForm";

describe("UserForm", () => {
  it("renders login form with all required elements", () => {
    render(<UserForm onSubmit={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "LOGIN" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays validation errors when submitting with empty fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserForm onSubmit={onSubmit} />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/EMAIL is required/i)).toBeInTheDocument();
      expect(screen.getByText(/PASSWORD is required/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit when form is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByPlaceholderText(/enter email/i),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("RESET button clears all form fields", async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText(/enter email/i),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "password123"
    );

    expect(screen.getByPlaceholderText(/enter email/i)).toHaveValue(
      "test@example.com"
    );
    expect(screen.getByPlaceholderText(/enter password/i)).toHaveValue(
      "password123"
    );

    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(screen.getByPlaceholderText(/enter email/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/enter password/i)).toHaveValue("");
  });

  it("displays error message when error prop is provided", () => {
    render(<UserForm onSubmit={vi.fn()} error="Invalid email or password" />);

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
});
