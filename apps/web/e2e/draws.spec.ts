import { test, expect } from "./fixtures.ts";

test("a visitor opens a draw and goes back with the game filter kept", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Game").selectOption({ label: "Daily Grand" });
  await expect(page).toHaveURL(/gameId=daily-grand/);

  await page
    .getByRole("link", { name: /^View details for Daily Grand on / })
    .first()
    .click();
  await expect(page).toHaveURL(/\/draws\//);
  await expect(page.getByRole("heading", { level: 1, name: "Draw details" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Daily Grand" })).toBeVisible();

  await page.getByRole("link", { name: "Back to results" }).click();
  await expect(page).toHaveURL(/gameId=daily-grand/);
  await expect(page.getByLabel("Game")).toHaveValue("daily-grand");
  await expect(page.getByRole("heading", { level: 2, name: "Daily Grand" }).first()).toBeVisible();
});

test("a visitor can page through the results", async ({ page }) => {
  await page.goto("/");
  const pagination = page.getByRole("navigation", { name: "Pagination" });
  await expect(pagination.getByText(/^Page 1 of /)).toBeVisible();
  await expect(pagination.getByRole("button", { name: "Previous" })).toBeDisabled();

  await pagination.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(pagination.getByText(/^Page 2 of /)).toBeVisible();

  await pagination.getByRole("button", { name: "Previous" }).click();
  await expect(pagination.getByText(/^Page 1 of /)).toBeVisible();
});

test("a shared link with a filter opens with that filter", async ({ page }) => {
  await page.goto("/?gameId=lotto-649&page=2");
  await expect(page.getByLabel("Game")).toHaveValue("lotto-649");
  await expect(page.getByText(/^Page 2 of /)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Lotto 6/49" }).first()).toBeVisible();
});

test("an unknown address shows the Not Found page", async ({ page }) => {
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Go to the results" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Results" })).toBeVisible();
});

test("a missing draw shows a friendly message", async ({ page }) => {
  await page.goto("/draws/does-not-exist");
  await expect(page.getByRole("status")).toContainText("Draw not found");
});

test("a visitor sees a friendly error when the API is down, and can try again", async ({
  page,
}) => {
  let apiIsDown = true;
  await page.route("**/api/v1/draws**", (route) => (apiIsDown ? route.abort() : route.continue()));

  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("could not be loaded", { timeout: 15_000 });

  apiIsDown = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("article").first()).toBeVisible();
});
