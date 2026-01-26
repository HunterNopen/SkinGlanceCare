import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import FinalForm from "../src/pages/FinalForm";

function renderWithRouter() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <FinalForm />,
        action: async () => null,
      },
    ],
    {
      initialEntries: ["/?mode=login"],
    },
  );

  render(<RouterProvider router={router} />);
}

describe("Login form", () => {
  it("renders login inputs and button", () => {
    renderWithRouter();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("allows user to type email and password", () => {
    renderWithRouter();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, {
      target: { value: "test@test.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });

    expect(emailInput.value).toBe("test@test.com");
    expect(passwordInput.value).toBe("password123");
  });
});
