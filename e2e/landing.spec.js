/**
 * E2E Tests - Landing Page
 *
 * Tests the main landing page (PresentationPage) functionality
 */
const { test, expect } = require('@playwright/test');

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the landing page', async ({ page }) => {
    // Check that the page title or main heading is visible
    await expect(page.locator('.mn-hero')).toBeVisible();
  });

  test('should display the navigation', async ({ page }) => {
    // Check navigation is visible
    await expect(page.locator('.mn-nav')).toBeVisible();

    // Check logo/brand is visible
    await expect(page.locator('.mn-logo')).toBeVisible();
  });

  test('should display the hero section', async ({ page }) => {
    // Hero title should exist
    await expect(page.locator('.mn-hero-title')).toBeVisible();

    // CTA buttons should be visible
    await expect(page.locator('.mn-hero-cta')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Check that anchor links exist
    const navLinks = page.locator('.mn-nav-links a');
    await expect(navLinks).toHaveCount(3); // How, Features, Pricing
  });

  test('should scroll to sections when clicking nav links', async ({ page }) => {
    // Click on "How it works" link
    await page.click('.mn-nav-links a[href="#how"]');

    // Wait a bit for smooth scroll
    await page.waitForTimeout(500);

    // The how section should be in view
    const howSection = page.locator('#how');
    await expect(howSection).toBeInViewport();
  });

  test('should display the ticker/marquee', async ({ page }) => {
    await expect(page.locator('.mn-ticker')).toBeVisible();
  });

  test('should display problem section', async ({ page }) => {
    await expect(page.locator('.mn-problem')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();

    // Should have feature cards
    const featureCards = page.locator('.mn-feat-card');
    const count = await featureCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display footer', async ({ page }) => {
    await expect(page.locator('.mn-footer')).toBeVisible();
  });

  test('should navigate to auth page when clicking Sign In', async ({ page }) => {
    // Click sign in button
    await page.click('button:has-text("Sign In")');

    // Should show loading transition or navigate
    // Wait for navigation
    await page.waitForURL('**/auth', { timeout: 5000 });

    expect(page.url()).toContain('/auth');
  });

  test('should have accessible elements', async ({ page }) => {
    // Check that logo has aria-label
    const logo = page.locator('.mn-logo');
    await expect(logo).toHaveAttribute('aria-label');

    // Hero title should have aria-label
    const heroTitle = page.locator('.mn-hero-title');
    await expect(heroTitle).toHaveAttribute('aria-label');
  });

  test('should be responsive - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Page should still render
    await expect(page.locator('.mn-hero')).toBeVisible();
  });
});
