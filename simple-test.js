import { chromium } from 'playwright';

async function simpleTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Test the exact same URL as the E2E test
    console.log('Navigating to /contact (relative URL)...');
    await page.goto('http://localhost:4321/contact');

    console.log('Waiting for page to load...');
    await page.waitForLoadState('networkidle');

    console.log('Checking if contact-form exists...');
    const formExists = await page.locator('#contact-form').count();
    console.log(`Form count: ${formExists}`);

    if (formExists > 0) {
      console.log('Form exists! Checking visibility...');
      const isVisible = await page.locator('#contact-form').isVisible();
      console.log(`Form visible: ${isVisible}`);

      // Try the exact same waitForSelector as the test
      console.log('Trying waitForSelector...');
      try {
        await page.waitForSelector('#contact-form', {
          state: 'visible',
          timeout: 5000,
        });
        console.log('waitForSelector succeeded!');
      } catch (error) {
        console.log('waitForSelector failed:', error.message);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

simpleTest();
