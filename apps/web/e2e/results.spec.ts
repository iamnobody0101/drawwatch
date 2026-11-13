import { test, expect } from "./fixtures.ts";

test("a visitor can filter the results by game", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Results" })).toBeVisible();
  await expect(page.getByRole("article").first()).toBeVisible();

  await page.getByLabel("Game").selectOption({ label: "Lotto Max" });

  await expect(page).toHaveURL(/gameId=lotto-max/);
  await expect(page.getByRole("heading", { level: 2, name: "Lotto Max" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Lotto 6/49" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2, name: "Daily Grand" })).toHaveCount(0);

  await page.getByLabel("Game").selectOption({ label: "All games" });
  await expect(page).not.toHaveURL(/gameId/);
});
