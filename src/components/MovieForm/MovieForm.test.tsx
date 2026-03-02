import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

import MovieForm from "@/components/MovieForm/MovieForm";

vi.mock("@/store/thunks/movieThunks", () => ({
  fetchMoviesThunk: vi.fn(),
  addMovieThunk: vi.fn(),
  updateMovieThunk: vi.fn(),
  deleteMovieThunk: vi.fn(),
  fetchMovieByIdThunk: vi.fn(),
}));

describe("MovieForm", () => {
  describe("Initial rendering (happy path)", () => {
    it("renders ADD MOVIE form with all required fields", () => {
      render(<MovieForm onSubmit={vi.fn()} onReset={vi.fn()} mode="add" />);

      expect(screen.getByText("ADD MOVIE")).toBeInTheDocument();
      expect(screen.getByText("TITLE")).toBeInTheDocument();
      expect(screen.getByText("RELEASE DATE")).toBeInTheDocument();
      expect(screen.getByText("POSTER URL")).toBeInTheDocument();
      expect(screen.getByText("RATING")).toBeInTheDocument();
      expect(screen.getByText("GENRE")).toBeInTheDocument();
      expect(screen.getByText("RUNTIME (MINUTES)")).toBeInTheDocument();
      expect(screen.getByText("OVERVIEW")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    it("renders EDIT MOVIE form when mode is edit", () => {
      render(
        <MovieForm
          onSubmit={vi.fn()}
          onReset={vi.fn()}
          mode="edit"
          movie={{
            id: 1,
            title: "Test Movie",
            release_date: "2020-01-01",
            poster_path: "https://example.com/poster.jpg",
            overview: "Overview",
            runtime: 120,
            genres: ["Drama"],
            vote_average: 8.5,
          }}
        />
      );

      expect(screen.getByText("EDIT MOVIE")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Movie")).toBeInTheDocument();
    });

    it("pre-fills form data when movie prop is provided", () => {
      const movie = {
        id: 1,
        title: "Inception",
        release_date: "2010-07-16",
        poster_path: "https://example.com/inception.jpg",
        overview: "A thief who steals corporate secrets through dream-sharing technology.",
        runtime: 148,
        genres: ["Action", "Science Fiction"],
        vote_average: 8.8,
      };

      render(<MovieForm onSubmit={vi.fn()} onReset={vi.fn()} mode="edit" movie={movie} />);

      expect(screen.getByDisplayValue("Inception")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2010-07-16")).toBeInTheDocument();
      expect(screen.getByDisplayValue("https://example.com/inception.jpg")).toBeInTheDocument();
      expect(screen.getByDisplayValue("148")).toBeInTheDocument();
      expect(screen.getByDisplayValue("8.8")).toBeInTheDocument();
      expect(screen.getByDisplayValue(/A thief who steals/i)).toBeInTheDocument();
    });
  });

  describe("Loading states", () => {
    it("disables submit button when isLoading is true", () => {
      render(
        <MovieForm
          onSubmit={vi.fn()}
          onReset={vi.fn()}
          mode="add"
          isLoading={true}
        />
      );

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it("submit button is enabled when isLoading is false", () => {
      render(
        <MovieForm
          onSubmit={vi.fn()}
          onReset={vi.fn()}
          mode="add"
          isLoading={false}
        />
      );

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeEnabled();
    });

    it("submit button is enabled by default when isLoading is not provided", () => {
      render(<MovieForm onSubmit={vi.fn()} onReset={vi.fn()} mode="add" />);

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeEnabled();
    });
  });

  describe("Form Validation", () => {
    it("displays validation errors when submitting empty form", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<MovieForm onSubmit={onSubmit} onReset={vi.fn()} mode="add" />);

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("Title is required")).toBeInTheDocument();
        expect(screen.getByText("Release date is required")).toBeInTheDocument();
        expect(screen.getByText("Poster URL is required")).toBeInTheDocument();
        expect(screen.getByText("Select at least one genre to proceed")).toBeInTheDocument();
        expect(screen.getByText("Overview is required")).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("displays general error message when multiple fields are empty", async () => {
      const user = userEvent.setup();
      render(<MovieForm onSubmit={vi.fn()} onReset={vi.fn()} mode="add" />);

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("ALL FIELDS ARE REQUIRED")).toBeInTheDocument();
      });
    });

    it("shows release date error when date is empty", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(<MovieForm onSubmit={onSubmit} onReset={vi.fn()} mode="add" />);

      const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
      await user.type(titleInput, "Test Movie");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("Release date is required")).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows poster URL error when URL is empty", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(<MovieForm onSubmit={onSubmit} onReset={vi.fn()} mode="add" />);

      const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
      await user.type(titleInput, "Test Movie");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("Poster URL is required")).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows overview error when overview is empty", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(<MovieForm onSubmit={onSubmit} onReset={vi.fn()} mode="add" />);

      const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
      await user.type(titleInput, "Test Movie");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("Overview is required")).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("User Interaction", () => {
    it("calls onSubmit with correct data when form is valid (with pre-selected genres)", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(
        <MovieForm 
          onSubmit={onSubmit} 
          onReset={vi.fn()} 
          mode="edit"
          movie={{
            id: 1,
            title: "Inception",
            release_date: "2010-07-16",
            poster_path: "https://example.com/inception.jpg",
            overview: "A thief who steals corporate secrets",
            genres: ["Action"],
            runtime: 0,
            vote_average: 0,
          }}
        />
      );

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
      });
      
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Inception",
          release_date: "2010-07-16",
          poster_path: "https://example.com/inception.jpg",
          overview: "A thief who steals corporate secrets",
          genres: ["Action"],
        })
      );
    });

    it("submits form with all fields filled including optional ones", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(
        <MovieForm 
          onSubmit={onSubmit} 
          onReset={vi.fn()} 
          mode="edit"
          movie={{
            id: 1,
            title: "Inception",
            release_date: "2010-07-16",
            poster_path: "https://example.com/inception.jpg",
            overview: "A thief who steals corporate secrets",
            genres: ["Action", "Science Fiction"],
            runtime: 148,
            vote_average: 8.8,
          }}
        />
      );

      const ratingInput = screen.getByDisplayValue("8.8") as HTMLInputElement;
      await user.clear(ratingInput);
      await user.type(ratingInput, "9.0");

      const runtimeInput = screen.getByDisplayValue("148") as HTMLInputElement;
      await user.clear(runtimeInput);
      await user.type(runtimeInput, "150");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Inception",
            vote_average: 9.0,
            runtime: 150,
          })
        );
      });
    });

    it("calls onReset when RESET button is clicked", async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();
      
      render(<MovieForm onSubmit={vi.fn()} onReset={onReset} mode="add" />);

      await user.click(screen.getByRole("button", { name: /reset/i }));

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Reset Logic", () => {
    it("RESET button restores form to initial movie state when in edit mode", async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();
      const movie = {
        id: 1,
        title: "Original",
        release_date: "2020-01-01",
        poster_path: "https://example.com/poster.jpg",
        overview: "Overview",
        runtime: 120,
        genres: ["Drama"],
      };
      
      render(
        <MovieForm
          onSubmit={vi.fn()}
          onReset={onReset}
          mode="edit"
          movie={movie}
        />
      );

      const titleInput = screen.getByDisplayValue("Original") as HTMLInputElement;
      await user.clear(titleInput);
      await user.type(titleInput, "Changed Title");

      expect(screen.getByDisplayValue("Changed Title")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /reset/i }));

      expect(onReset).toHaveBeenCalled();
    });

    it("RESET clears validation errors", async () => {
      const user = userEvent.setup();
      
      render(<MovieForm onSubmit={vi.fn()} onReset={vi.fn()} mode="add" />);

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("Title is required")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /reset/i }));

      expect(screen.queryByText("Title is required")).not.toBeInTheDocument();
    });
  });

  describe("Error state handling", () => {
    it("clears field-specific error when user types in that field", async () => {
      const user = userEvent.setup();
      
      render(<MovieForm onSubmit={vi.fn()} onReset={vi.fn()} mode="add" />);

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("Title is required")).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
      await user.type(titleInput, "A");

      expect(screen.queryByText("Title is required")).not.toBeInTheDocument();
    });

    it("clears general error when user starts typing", async () => {
      const user = userEvent.setup();
      
      render(<MovieForm onSubmit={vi.fn()} onReset={vi.fn()} mode="add" />);

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText("ALL FIELDS ARE REQUIRED")).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
      await user.type(titleInput, "A");

      expect(screen.queryByText("ALL FIELDS ARE REQUIRED")).not.toBeInTheDocument();
    });
  });

  describe("Optional fields", () => {
    it("submits form with default values for optional fields", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(
        <MovieForm 
          onSubmit={onSubmit} 
          onReset={vi.fn()} 
          mode="edit"
          movie={{
            id: 1,
            title: "Test Movie",
            release_date: "2024-01-01",
            poster_path: "https://example.com/poster.jpg",
            overview: "Test overview",
            genres: ["Drama"],
            runtime: 0,
            vote_average: 0,
          }}
        />
      );

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });

      const submittedData = onSubmit.mock.calls[0][0];
      expect(submittedData.runtime).toBe(0);
      expect(submittedData.vote_average).toBe(0);
    });

    it("handles rating as decimal input", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(
        <MovieForm 
          onSubmit={onSubmit} 
          onReset={vi.fn()} 
          mode="edit"
          movie={{
            id: 1,
            title: "Test Movie",
            release_date: "2024-01-01",
            poster_path: "https://example.com/poster.jpg",
            overview: "Test overview",
            genres: ["Drama"],
            runtime: 0,
            vote_average: 0,
          }}
        />
      );

      const ratingInput = screen.getByLabelText("RATING") as HTMLInputElement;
      await user.clear(ratingInput);
      await user.type(ratingInput, "7.5");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            vote_average: 7.5,
          })
        );
      });
    });

    it("handles runtime as integer input", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      
      render(
        <MovieForm 
          onSubmit={onSubmit} 
          onReset={vi.fn()} 
          mode="edit"
          movie={{
            id: 1,
            title: "Test Movie",
            release_date: "2024-01-01",
            poster_path: "https://example.com/poster.jpg",
            overview: "Test overview",
            genres: ["Drama"],
            runtime: 0,
            vote_average: 0,
          }}
        />
      );

      const runtimeInput = screen.getByLabelText("RUNTIME (MINUTES)") as HTMLInputElement;
      await user.clear(runtimeInput);
      await user.type(runtimeInput, "120");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            runtime: 120,
          })
        );
      });
    });
  });
});

