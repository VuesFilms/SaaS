import { test, expect } from "@playwright/test";

test.describe("Internationalization (i18n)", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so each test starts with the default language (English)
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("default language is English", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("My Projects");
    await expect(page.locator("nav")).toContainText("Dashboard");
    await expect(page.locator("nav")).toContainText("Login");
  });

  test("switching to Arabic changes text direction to RTL", async ({ page }) => {
    // The language toggle button shows "AR" when current language is English
    await page.click("button:has-text('AR')");

    // The <html> element should now have dir="rtl"
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("switching back to English restores LTR", async ({ page }) => {
    // Switch to Arabic first
    await page.click("button:has-text('AR')");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    // The toggle now shows "EN" -- click to go back to English
    await page.click("button:has-text('EN')");

    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("Arabic translations appear when language is switched", async ({ page }) => {
    // Switch to Arabic
    await page.click("button:has-text('AR')");

    // Verify Arabic translations are rendered
    await expect(page.locator("h1")).toHaveText("مشاريعي");
    await expect(page.locator("nav")).toContainText("لوحة القيادة");
    await expect(page.locator("nav")).toContainText("تسجيل الدخول");
    await expect(page.locator("nav")).toContainText("فيلم ساس");
  });
});
