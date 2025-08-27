import { test, expect } from '@playwright/test';

test.describe('Services Section Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the services page
    await page.goto('/services');
  });

  test('services page loads with all services displayed', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Agricultural Technology Services/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Agricultural Technology Services');
    
    // Check that all 5 services are displayed
    const serviceCards = page.locator('.service-detail-card');
    await expect(serviceCards).toHaveCount(5);
    
    // Check specific service titles
    await expect(page.locator('h3').filter({ hasText: 'Custom IoT Integrations for Small Farms' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Mobile Farm Management Apps' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Agricultural Data Analytics' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Precision Agriculture APIs' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Farm Automation Systems' })).toBeVisible();
  });

  test('service navigation links work correctly', async ({ page }) => {
    // Check that quick navigation links exist
    const navLinks = page.locator('.services-nav-list a');
    await expect(navLinks).toHaveCount(5);
    
    // Test clicking on a navigation link
    await navLinks.first().click();
    
    // Should scroll to the corresponding service section
    // We can verify this by checking if the URL has a hash
    await expect(page.url()).toContain('#service-');
  });

  test('service CTA links are functional', async ({ page }) => {
    // Find all service CTA buttons
    const ctaButtons = page.locator('.service-cta-large');
    
    // Check that CTA buttons exist
    await expect(ctaButtons.first()).toBeVisible();
    
    // Check that CTA buttons have proper href attributes
    const firstCta = ctaButtons.first();
    const href = await firstCta.getAttribute('href');
    expect(href).toContain('/contact');
  });

  test('related projects links work', async ({ page }) => {
    // Find related project cards
    const projectCards = page.locator('.related-project-card');
    
    if (await projectCards.count() > 0) {
      const firstProjectCard = projectCards.first();
      const href = await firstProjectCard.getAttribute('href');
      expect(href).toContain('/projects/');
      
      // Click and verify navigation
      await firstProjectCard.click();
      await expect(page.url()).toContain('/projects/');
    }
  });

  test('individual service pages are accessible', async ({ page }) => {
    // Test navigation to individual service pages
    const serviceIds = ['iot-integration', 'mobile-apps', 'data-analytics', 'api-development', 'automation-systems'];
    
    for (const serviceId of serviceIds) {
      await page.goto(`/services/${serviceId}`);
      
      // Check that the page loads successfully
      await expect(page.locator('h1')).toBeVisible();
      
      // Check breadcrumb navigation
      await expect(page.locator('.breadcrumb')).toBeVisible();
      await expect(page.locator('.breadcrumb a[href="/services"]')).toBeVisible();
      
      // Check service hero section
      await expect(page.locator('.service-hero')).toBeVisible();
      
      // Check service content
      await expect(page.locator('.service-content-section')).toBeVisible();
    }
  });

  test('service detail page navigation works', async ({ page }) => {
    // Go to a specific service page
    await page.goto('/services/iot-integration');
    
    // Test breadcrumb navigation back to services
    await page.locator('.breadcrumb a[href="/services"]').click();
    await expect(page.url()).toContain('/services');
    await expect(page.url()).not.toContain('/services/');
  });

  test('contact CTA section is functional', async ({ page }) => {
    // Check contact CTA section exists
    await expect(page.locator('.contact-cta-section')).toBeVisible();
    
    // Check primary CTA button
    const primaryCta = page.locator('.contact-cta-section .primary-cta');
    await expect(primaryCta).toBeVisible();
    
    const href = await primaryCta.getAttribute('href');
    expect(href).toBe('/contact');
    
    // Check secondary CTA button
    const secondaryCta = page.locator('.contact-cta-section .secondary-cta');
    await expect(secondaryCta).toBeVisible();
    
    const secondaryHref = await secondaryCta.getAttribute('href');
    expect(secondaryHref).toBe('/showcase');
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that services are still visible and properly laid out
    const serviceCards = page.locator('.service-detail-card');
    await expect(serviceCards.first()).toBeVisible();
    
    // Check that navigation adapts to mobile
    const navLinks = page.locator('.services-nav-list');
    await expect(navLinks).toBeVisible();
  });
});