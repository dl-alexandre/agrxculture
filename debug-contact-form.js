import { chromium } from 'playwright';

async function debugContactForm() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Navigating to contact page...');
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

      if (isVisible) {
        console.log('Form is visible! Checking name field...');
        const nameField = await page.locator('#name').count();
        console.log(`Name field count: ${nameField}`);

        if (nameField > 0) {
          const nameVisible = await page.locator('#name').isVisible();
          console.log(`Name field visible: ${nameVisible}`);
        }
      }
    }

    // Take a screenshot
    await page.screenshot({ path: 'debug-contact-form.png' });
    console.log('Screenshot saved as debug-contact-form.png');

    // Get page content
    const content = await page.content();
    const formInContent = content.includes('id="contact-form"');
    console.log(`Form in page content: ${formInContent}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugContactForm();
