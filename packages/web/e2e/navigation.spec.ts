import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage shows the dashboard with projects heading", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toHaveText("My Projects");
  });

  test("clicking login link shows login form", async ({ page }) => {
    await page.goto("/");

    await page.click('a[href="/login"]');

    await expect(page).toHaveURL("/login");
    await expect(page.locator("h1")).toHaveText("Login");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("clicking register link shows register form", async ({ page }) => {
    await page.goto("/login");

    await page.click('a[href="/register"]');

    await expect(page).toHaveURL("/register");
    await expect(page.locator("h1")).toHaveText("Register");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[id="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("unknown route shows 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await expect(page.locator("h1")).toHaveText("404");
    await expect(page.locator("text=Page not found")).toBeVisible();
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });
});
