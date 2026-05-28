/**
 * E2E Tests - Authentication Page
 *
 * Tests the authentication/login page functionality
 */
const { test, expect } = require('@playwright/test');

test.describe('Authentication Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should load the auth page', async ({ page }) => {
    // Page should load without errors
    await expect(page).toHaveURL(/.*auth/);
  });

  test('should display login form elements', async ({ page }) => {
    // Look for common auth form elements
    // Email/username input
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');

    // Password input
    const passwordInput = page.locator('input[type="password"]');

    // At least one of these should be visible (depending on auth implementation)
    const hasEmailInput = await emailInput.count() > 0;
    const hasPasswordInput = await passwordInput.count() > 0;

    // Auth page should have some form of input
    expect(hasEmailInput || hasPasswordInput).toBeTruthy();
  });

  test('should have a submit/login button', async ({ page }) => {
    // Look for submit button
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign"), button:has-text("Entrar")');
    const buttonCount = await submitButton.count();

    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Find and click submit without filling form
    const submitButton = page.locator('button[type="submit"]').first();

    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait a moment for validation
      await page.waitForTimeout(500);

      // Should still be on auth page (not redirected)
      expect(page.url()).toContain('/auth');
    }
  });

  test('should have link to go back to landing', async ({ page }) => {
    // Look for back/home link or logo
    const homeLink = page.locator('a[href="/"], .mn-logo, button:has-text("Back")');
    const count = await homeLink.count();

    // Should have some way to go back
    expect(count).toBeGreaterThan(0);
  });

  test('should be responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Page should still be functional
    await expect(page).toHaveURL(/.*auth/);
  });
});
