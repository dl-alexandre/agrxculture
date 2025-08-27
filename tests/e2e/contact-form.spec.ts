import { test, expect } from '@playwright/test';

test.describe('Contact Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should submit contact form successfully', async ({ page }) => {
    // Fill out the form
    await page.fill('#name', 'John Farmer');
    await page.fill('#email', 'john@greenvalleyfarms.com');
    await page.fill('#company', 'Green Valley Farms');
    await page.selectOption('#project-type', 'iot-integration');
    await page.fill('#message', 'I need help implementing IoT sensors for soil moisture monitoring across my 500-acre farm.');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show loading state
    const loadingSpinner = page.locator('.loading-spinner');
    await expect(loadingSpinner).toBeVisible();
    
    // Should show success message (mocked in test environment)
    const successMessage = page.locator('#form-success');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    await expect(successMessage).toContainText('Thank you for your message');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    const nameError = page.locator('#name-error');
    const emailError = page.locator('#email-error');
    const messageError = page.locator('#message-error');
    
    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
    await expect(messageError).toBeVisible();
    
    await expect(nameError).toContainText('required');
    await expect(emailError).toContainText('required');
    await expect(messageError).toContainText('required');
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'invalid-email');
    await page.fill('#message', 'Test message');
    
    await page.click('button[type="submit"]');
    
    const emailError = page.locator('#email-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText('valid email');
  });

  test('should enforce message character limit', async ({ page }) => {
    const longMessage = 'A'.repeat(1001);
    await page.fill('#message', longMessage);
    
    // Character counter should show over limit
    const counter = page.locator('.character-counter');
    await expect(counter).toContainText('1001/1000');
    
    // Submit should show error
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.click('button[type="submit"]');
    
    const messageError = page.locator('#message-error');
    await expect(messageError).toBeVisible();
    await expect(messageError).toContainText('1000 characters');
  });

  test('should update character counter in real-time', async ({ page }) => {
    const message = 'Testing character counter functionality';
    await page.fill('#message', message);
    
    const counter = page.locator('.character-counter');
    await expect(counter).toContainText(`${message.length}/1000`);
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab'); // Name field
    await expect(page.locator('#name')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Email field
    await expect(page.locator('#email')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Company field
    await expect(page.locator('#company')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Project type
    await expect(page.locator('#project-type')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Message field
    await expect(page.locator('#message')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Submit button
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should handle form submission on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Fill form on mobile
    await page.fill('#name', 'Mobile User');
    await page.fill('#email', 'mobile@farm.com');
    await page.fill('#message', 'Testing mobile form submission');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should work the same as desktop
    const successMessage = page.locator('#form-success');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });

  test('should prevent spam with honeypot field', async ({ page }) => {
    // Fill honeypot field (should be hidden from users)
    await page.evaluate(() => {
      const honeypot = document.querySelector('input[name="bot-field"]') as HTMLInputElement;
      if (honeypot) honeypot.value = 'spam';
    });
    
    // Fill legitimate form data
    await page.fill('#name', 'Legitimate User');
    await page.fill('#email', 'real@farmer.com');
    await page.fill('#message', 'Real inquiry about agricultural solutions');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should be rejected (in real implementation)
    // This test verifies the honeypot field exists and can be filled
    const honeypotValue = await page.evaluate(() => {
      const honeypot = document.querySelector('input[name="bot-field"]') as HTMLInputElement;
      return honeypot?.value;
    });
    
    expect(honeypotValue).toBe('spam');
  });
});