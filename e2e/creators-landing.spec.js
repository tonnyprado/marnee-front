/**
 * E2E Tests - Creators Landing Page
 *
 * Tests the creators-specific landing page functionality
 */
const { test, expect } = require('@playwright/test');

test.describe('Creators Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/creators');
  });

  test('should load the creators landing page', async ({ page }) => {
    // Check that the page loads with creator-specific content
    await expect(page.locator('.mn-hero--creators')).toBeVisible();
  });

  test('should display creator-focused hero content', async ({ page }) => {
    // Check for creator-specific messaging
    const heroTag = page.locator('.mn-hero-tag');
    await expect(heroTag).toContainText('creator');
  });

  test('should display the waitlist form', async ({ page }) => {
    // Waitlist form should be visible
    const waitlistForm = page.locator('.mn-waitlist-form');
    await expect(waitlistForm).toBeVisible();

    // Email input should exist
    const emailInput = page.locator('.mn-waitlist-input');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Submit button should exist
    const submitBtn = page.locator('.mn-waitlist-btn');
    await expect(submitBtn).toBeVisible();
  });

  test('should validate email input', async ({ page }) => {
    const emailInput = page.locator('.mn-waitlist-input');
    const submitBtn = page.locator('.mn-waitlist-btn');

    // Enter invalid email
    await emailInput.fill('invalid-email');
    await submitBtn.click();

    // Form should not show success (HTML5 validation)
    // The form uses noValidate but has JS validation
    const successMessage = page.locator('.mn-waitlist-success');
    await expect(successMessage).not.toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check nav links
    const howLink = page.locator('.mn-nav-links a[href="#how"]');
    await expect(howLink).toBeVisible();

    await howLink.click();
    await page.waitForTimeout(500);

    const howSection = page.locator('#how');
    await expect(howSection).toBeInViewport();
  });

  test('should display problem section with creator pain points', async ({ page }) => {
    const problemSection = page.locator('.mn-problem');
    await expect(problemSection).toBeVisible();

    // Should have pain point cards
    const painCards = page.locator('.mn-pain-card');
    await expect(painCards).toHaveCount(3);
  });

  test('should display features section', async ({ page }) => {
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();
  });

  test('should display "Who it\'s for" section', async ({ page }) => {
    const whoSection = page.locator('.mn-who');
    await expect(whoSection).toBeVisible();

    // Should have creator type cards
    const whoCards = page.locator('.mn-who-card');
    const count = await whoCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display final CTA section', async ({ page }) => {
    const ctaSection = page.locator('#waitlist');
    await expect(ctaSection).toBeVisible();

    // Should have another waitlist form
    const ctaForm = ctaSection.locator('.mn-waitlist-form');
    await expect(ctaForm).toBeVisible();
  });

  test('should navigate to auth page when clicking Sign In', async ({ page }) => {
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/auth', { timeout: 5000 });
    expect(page.url()).toContain('/auth');
  });

  test('should be responsive - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.mn-hero--creators')).toBeVisible();
  });

  test('should be responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.mn-hero--creators')).toBeVisible();
  });
});
