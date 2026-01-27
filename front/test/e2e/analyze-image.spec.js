import { expect, test } from "@playwright/test";

import { fileURLToPath } from "url";
import path from "path";

test("User logs in, uploads image and receives AI analysis", async ({
  page,
}) => {
  const BASE_URL = "https://skinglancecare-front.onrender.com/";

  const imagePath = fileURLToPath(
    new URL("../fixtures/test-image.jpg", import.meta.url),
  );

  await page.goto(`${BASE_URL}/auth?mode=login`);

  await page.fill('[data-testid="login-email"]', "gicet65273@coswz.com");
  await page.fill('[data-testid="login-password"]', "zaq1@WSX");
  await page.click('[data-testid="login-submit"]');

  await expect(page).toHaveURL(/\/$/);

  await page.setInputFiles('[data-testid="file-input"]', imagePath);

  await page.click('[data-testid="start-analysis"]');

  await expect(page.getByTestId("analysis-result-title"), {
    timeout: 90_000,
  }).toBeVisible();

  await expect(page.getByText(/predicted lesion/i)).toBeVisible();

  const riskLevel = page.getByTestId("risk-level");
  await expect(riskLevel).not.toContainText("UNKNOWN");
});
