import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate between all main pages', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Agrxculture/);
    
    // Navigate to Services
    await page.click('nav a[href="/services"]');
    await expect(page).toHaveURL('/services');
    await expect(page.locator('h1')).toContainText('Services');
    
    // Navigate to Showcase
    await page.click('nav a[href="/showcase"]');
    await expect(page).toHaveURL('/showcase');
    await expect(page.locator('h1')).toContainText('Projects');
    
    // Navigate to Contact
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
    
    // Return to Home
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('should have working skip link for accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Focus on skip link (usually hidden until focused)
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
    
    // Click skip link
    await skipLink.click();
    
    // Main content should be focused
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('should have responsive mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu button should be visible
    const menuButton = page.locator('.mobile-menu-toggle');
    await expect(menuButton).toBeVisible();
    
    // Click to open menu
    await menuButton.click();
    
    // Navigation should be visible
    const nav = page.locator('nav ul');
    await expect(nav).toBeVisible();
    
    // Click a navigation link
    await page.click('nav a[href="/services"]');
    await expect(page).toHaveURL('/services');
  });

  test('should maintain focus management during navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav item
    
    const firstNavLink = page.locator('nav a').first();
    await expect(firstNavLink).toBeFocused();
    
    // Navigate using keyboard
    await page.keyboard.press('Enter');
    
    // Should navigate and maintain logical focus
    await expect(page.locator('h1')).toBeVisible();
  });
});