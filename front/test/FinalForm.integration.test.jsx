import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import FinalForm from "../src/pages/FinalForm";

describe("Integracyjny test logowania z backendem", () => {
  const testEmail = "admin@wp.pl";
  const testPassword = "zaq1@WSX";

  beforeEach(() => localStorage.clear());

  it("powinien zalogować użytkownika i zapisać token w localStorage", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/auth",
          element: <FinalForm />,
          action: async ({ request }) => {
            const formData = await request.formData();
            const username = formData.get("email");
            const password = formData.get("password");

            const res = await fetch("http://localhost:8000/access/login/", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({ username, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Login failed");

            localStorage.setItem("token", data.access_token);

            return data;
          },
        },
      ],
      { initialEntries: ["/auth?mode=login"] },
    );

    render(<RouterProvider router={router} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: testEmail },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: testPassword },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      const token = localStorage.getItem("token");
      expect(token).not.toBeNull();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(10);
    });
  });
});
