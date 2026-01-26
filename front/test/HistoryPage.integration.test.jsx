import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";
import HistoryPage from "../src/pages/HistoryPage";

describe("Integration: HistoryPage + backend + DB", () => {
  const TEST_EMAIL = "admin@wp.pl";
  const TEST_PASSWORD = "zaq1@WSX";

  beforeAll(async () => {
    const res = await fetch("http://localhost:8000/access/login/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("pobiera pierwsze 8 zdjęć i ładuje kolejne po kliknięciu 'Wczytaj więcej'", async () => {
    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>,
    );

    const firstBatch = await screen.findAllByRole("img");
    expect(firstBatch.length).toBeGreaterThan(0);
    expect(firstBatch.length).toBeLessThanOrEqual(8);

    const loadMoreButton = screen.getByRole("button", {
      name: /Load more/i,
    });
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      const allImages = screen.getAllByRole("img");
      expect(allImages.length).toBeGreaterThan(8);
    });
  });
});
