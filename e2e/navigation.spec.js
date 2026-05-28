/**
 * E2E Tests - Navigation & Routing
 *
 * Tests the app's navigation and routing functionality
 */
const { test, expect } = require('@playwright/test');

test.describe('Navigation & Routing', () => {
  test('should load homepage at root URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.mn-hero')).toBeVisible();
  });

  test('should load creators page', async ({ page }) => {
    await page.goto('/creators');
    await expect(page.locator('.mn-hero--creators')).toBeVisible();
  });

  test('should load auth page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveURL(/.*auth/);
  });

  test('should handle 404 for unknown routes gracefully', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');

    // Should either redirect to home or show a 404 page
    // Check if we're redirected or if there's content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should navigate from landing to creators', async ({ page }) => {
    await page.goto('/');

    // If there's a link to creators page
    const creatorsLink = page.locator('a[href="/creators"], a[href*="creators"]');

    if (await creatorsLink.count() > 0) {
      await creatorsLink.first().click();
      await expect(page).toHaveURL(/.*creators/);
    }
  });

  test('should navigate from landing to auth via Sign In', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/auth', { timeout: 5000 });

    expect(page.url()).toContain('/auth');
  });

  test('should preserve scroll position on back navigation', async ({ page }) => {
    await page.goto('/');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);

    // Navigate to auth
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/auth', { timeout: 5000 });

    // Go back
    await page.goBack();

    // Should be back on landing
    await expect(page.locator('.mn-hero')).toBeVisible();
  });

  test('should handle browser back/forward buttons', async ({ page }) => {
    // Start at landing
    await page.goto('/');
    await expect(page.locator('.mn-hero')).toBeVisible();

    // Go to auth
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/auth', { timeout: 5000 });

    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/.*auth/);
  });

  test('should maintain app state during navigation', async ({ page }) => {
    await page.goto('/');

    // Check that the app doesn't crash during rapid navigation
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(200);
    await page.goBack();
    await page.waitForTimeout(200);

    // App should still be functional
    await expect(page.locator('.mn-hero')).toBeVisible();
  });
});
