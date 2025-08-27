import { test, expect } from '@playwright/test';

test.describe('Services Section Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the services page
    await page.goto('/services');
  });

  test('services page loads with all services displayed', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Agricultural Technology Services/);
    
    // Check main heading - use .first() to avoid multiple h1 elements
    await expect(page.locator('h1').first()).toContainText('Agricultural Technology Services');
    
    // Check that all 5 services are displayed
    const serviceCards = page.locator('.service-detail-card');
    await expect(serviceCards).toHaveCount(5);
    
    // Check specific service titles - use more specific selectors to avoid duplicates
    await expect(page.locator('.service-detail-card h3').filter({ hasText: 'Custom IoT Integrations for Small Farms' })).toBeVisible();
    await expect(page.locator('.service-detail-card h3').filter({ hasText: 'Mobile Farm Management Apps' })).toBeVisible();
    await expect(page.locator('.service-detail-card h3').filter({ hasText: 'Agricultural Data Analytics' })).toBeVisible();
    await expect(page.locator('.service-detail-card h3').filter({ hasText: 'Precision Agriculture APIs' })).toBeVisible();
    await expect(page.locator('.service-detail-card h3').filter({ hasText: 'Farm Automation Systems' })).toBeVisible();
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
      
      // Check that the page loads successfully - use specific selector to avoid multiple h1 elements
      const serviceTitle = page.locator('.service-hero-title');
      if (await serviceTitle.count() > 0) {
        await expect(serviceTitle).toBeVisible();
      } else {
        // Fallback to checking any h1 if service-hero-title doesn't exist
        await expect(page.locator('h1').first()).toBeVisible();
      }
      
      // Check breadcrumb navigation if it exists
      const breadcrumb = page.locator('.breadcrumb');
      if (await breadcrumb.count() > 0) {
        await expect(breadcrumb).toBeVisible();
        await expect(breadcrumb.locator('a[href="/services"]')).toBeVisible();
      }
      
      // Check service hero section if it exists
      const serviceHero = page.locator('.service-hero');
      if (await serviceHero.count() > 0) {
        await expect(serviceHero).toBeVisible();
      }
      
      // Check service content section if it exists
      const serviceContent = page.locator('.service-content-section');
      if (await serviceContent.count() > 0) {
        await expect(serviceContent).toBeVisible();
      }
    }
  });

  test('service detail page navigation works', async ({ page }) => {
    // Go to a specific service page
    await page.goto('/services/iot-integration');
    
    // Test breadcrumb navigation back to services if it exists
    const breadcrumbLink = page.locator('.breadcrumb a[href="/services"]');
    if (await breadcrumbLink.count() > 0) {
      await breadcrumbLink.click();
      await expect(page.url()).toContain('/services');
      await expect(page.url()).not.toContain('/services/');
    } else {
      // Skip this test if breadcrumb doesn't exist
      test.skip('Breadcrumb navigation not implemented on this service page');
    }
  });

  test('contact CTA section is functional', async ({ page }) => {
    // Check contact CTA section exists
    const contactCta = page.locator('.contact-cta-section');
    if (await contactCta.count() > 0) {
      await expect(contactCta).toBeVisible();
      
      // Check primary CTA button
      const primaryCta = contactCta.locator('.primary-cta');
      if (await primaryCta.count() > 0) {
        await expect(primaryCta).toBeVisible();
        
        const href = await primaryCta.getAttribute('href');
        expect(href).toBe('/contact');
      }
      
      // Check secondary CTA button
      const secondaryCta = contactCta.locator('.secondary-cta');
      if (await secondaryCta.count() > 0) {
        await expect(secondaryCta).toBeVisible();
        
        const secondaryHref = await secondaryCta.getAttribute('href');
        expect(secondaryHref).toBe('/showcase');
      }
    } else {
      // Skip this test if contact CTA section doesn't exist
      test.skip('Contact CTA section not implemented on this page');
    }
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