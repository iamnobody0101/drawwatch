import { test, expect } from "@playwright/test";

test("a visitor can change the game on the Stats page", async ({ page }) => {
  await page.goto("/stats");
  await expect(page.getByRole("heading", { level: 1, name: "Stats" })).toBeVisible();
  await expect(page.getByLabel("Game")).toHaveValue("lotto-649");
  await expect(page.getByRole("region", { name: /^Lotto 6\/49: how often/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /^Hot/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /^Cold/ })).toBeVisible();

  await page.getByLabel("Game").selectOption({ label: "Lotto Max" });

  await expect(page).toHaveURL(/gameId=lotto-max/);
  await expect(page.getByRole("region", { name: /^Lotto Max: how often/ })).toBeVisible();
});

test("a visitor can narrow the Stats to a date range", async ({ page }) => {
  // The sample data is always the same: 522 Lotto 6/49 draws, 105 of them in 2025.
  await page.goto("/stats");
  await expect(page.getByText(/^Based on 522 draws/)).toBeVisible();

  await page.getByLabel("From", { exact: true }).fill("2025-01-01");
  await page.getByLabel("To", { exact: true }).fill("2025-12-31");

  await expect(page).toHaveURL(/from=2025-01-01/);
  await expect(page).toHaveURL(/to=2025-12-31/);
  await expect(page.getByText(/^Based on 105 draws/)).toBeVisible();
});

test("the Stats page warns when From is after To", async ({ page }) => {
  await page.goto("/stats");
  await page.getByLabel("From", { exact: true }).fill("2026-01-01");
  await page.getByLabel("To", { exact: true }).fill("2025-01-01");

  await expect(page.getByRole("alert")).toHaveText("The From date must not be after the To date.");
  await expect(page.getByRole("region", { name: /how often/ })).toHaveCount(0);
});

test("the Stats page explains an empty date range", async ({ page }) => {
  await page.goto("/stats");
  await page.getByLabel("From", { exact: true }).fill("2030-01-01");
  await page.getByLabel("To", { exact: true }).fill("2030-12-31");

  await expect(page.getByText("No draws in this date range")).toBeVisible();
});

test("a visitor can switch the chart to a table and back", async ({ page }) => {
  await page.goto("/stats");
  const chart = page.getByRole("region", { name: /how often/ });
  await expect(chart.getByRole("table")).toHaveCount(0);

  await chart.getByRole("button", { name: "Show as table" }).click();
  await expect(chart.getByRole("table")).toBeVisible();
  await expect(chart.getByRole("columnheader", { name: "Times drawn" })).toBeVisible();

  await chart.getByRole("button", { name: "Show as chart" }).click();
  await expect(chart.getByRole("table")).toHaveCount(0);
  await expect(chart.getByRole("button", { name: "Show as table" })).toBeVisible();
});

test("a shared Stats link opens with its game and dates", async ({ page }) => {
  await page.goto("/stats?gameId=daily-grand&from=2025-01-01&to=2025-06-30");

  await expect(page.getByLabel("Game")).toHaveValue("daily-grand");
  await expect(page.getByLabel("From", { exact: true })).toHaveValue("2025-01-01");
  await expect(page.getByLabel("To", { exact: true })).toHaveValue("2025-06-30");
  await expect(page.getByRole("region", { name: /^Daily Grand: how often/ })).toBeVisible();
});
