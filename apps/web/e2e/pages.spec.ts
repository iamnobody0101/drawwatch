import { test, expect } from "./fixtures.ts";

// Each test ends on one page state. The accessibility scan in fixtures.ts checks that state.

test("the About page has no accessibility problems", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1, name: "About DrawWatch" })).toBeVisible();
});

test("the Stats chart shown as a table has no accessibility problems", async ({ page }) => {
  await page.goto("/stats");
  await page.getByRole("button", { name: "Show as table" }).click();
  await expect(page.getByRole("table")).toBeVisible();
});

test("the slow-server message has no accessibility problems", async ({ page }) => {
  await page.route("**/api/v1/health", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    await route.continue();
  });
  await page.goto("/");
  await expect(page.getByText("Waking up the server...")).toBeVisible();
});

test("the draws error message has no accessibility problems", async ({ page }) => {
  await page.route("**/api/v1/draws**", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("could not be loaded", { timeout: 15_000 });
});
