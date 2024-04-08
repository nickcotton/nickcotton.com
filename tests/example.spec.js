// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Nick/);
});

// test("get in touch link", async ({ page }) => {
//   await page.goto("/");

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get in touch" }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" }),
//   ).toBeVisible();
// });
