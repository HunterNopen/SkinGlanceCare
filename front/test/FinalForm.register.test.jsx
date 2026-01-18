import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import FinalForm from "../src/pages/FinalForm";

describe("Integracyjny test rejestracji (frontend) - Vitest", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("powinien zarejestrować użytkownika i pokazać komunikat o sukcesie", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message:
          "Registration successful. Check your email to verify your account.",
      }),
    });

    const router = createMemoryRouter(
      [
        {
          path: "/auth",
          element: <FinalForm />,
          action: async ({ request }) => {
            const formData = await request.formData();

            const res = await fetch("http://localhost:8000/access/register/", {
              method: "POST",
              body: new URLSearchParams(formData),
            });

            const data = await res.json();
            return data;
          },
        },
      ],
      {
        initialEntries: ["/auth?mode=add_user"],
      },
    );

    render(<RouterProvider router={router} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "newuser@test.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Test123!" },
    });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });

    fireEvent.click(screen.getByRole("button", { name: /get started/i }));

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBeNull();
  });
});
