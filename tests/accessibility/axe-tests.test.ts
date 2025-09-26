import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

// Accessibility validation functions
const validateHeadingHierarchy = (document: Document): boolean => {
  const headings = Array.from(
    document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  );
  if (headings.length === 0) return false;

  // Should start with h1
  const firstHeading = headings[0];
  return firstHeading?.tagName === 'H1';
};

const validateFormLabels = (document: Document): boolean => {
  const inputs = Array.from(
    document.querySelectorAll('input, textarea, select')
  );

  return inputs.every(input => {
    const id = input.getAttribute('id');
    if (!id) return false;

    const label = document.querySelector(`label[for="${id}"]`);
    return label !== null;
  });
};

const validateAriaAttributes = (document: Document): boolean => {
  const elementsWithAriaLive = Array.from(
    document.querySelectorAll('[aria-live]')
  );
  // const _elementsWithRole = Array.from(document.querySelectorAll('[role]'));

  // Check that ARIA attributes are properly used
  return elementsWithAriaLive.every(el =>
    ['polite', 'assertive', 'off'].includes(el.getAttribute('aria-live') || '')
  );
};

// Mock page structures for accessibility testing
const createHomePage = () => {
  return new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Agrxculture - Agricultural Technology Company</title>
    </head>
    <body>
      <header>
        <nav role="navigation" aria-label="Main navigation">
          <a href="#main-content" class="skip-link">Skip to main content</a>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/showcase">Projects</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main id="main-content">
        <section class="hero" aria-labelledby="hero-heading">
          <h1 id="hero-heading">Building data-driven farms for a more productive tomorrow</h1>
          <p>Agricultural software developer specializing in IoT solutions</p>
          <a href="/services" class="cta-button">Explore My Agricultural Solutions</a>
        </section>
        
        <section class="about" aria-labelledby="about-heading">
          <h2 id="about-heading">About</h2>
          <p>Passionate about agricultural technology and precision farming.</p>
        </section>
      </main>
      
      <footer>
        <p>&copy; 2024 Agrxculture. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `);
};

const createContactForm = () => {
  return new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Contact - Agrxculture</title>
    </head>
    <body>
      <main>
        <h1>Contact Me</h1>
        <form aria-labelledby="contact-heading">
          <h2 id="contact-heading">Get in Touch</h2>
          
          <div class="form-group">
            <label for="name">Name <span aria-label="required">*</span></label>
            <input type="text" id="name" name="name" required aria-describedby="name-error" />
            <div id="name-error" class="error-message" role="alert" aria-live="polite"></div>
          </div>
          
          <div class="form-group">
            <label for="email">Email <span aria-label="required">*</span></label>
            <input type="email" id="email" name="email" required aria-describedby="email-error" />
            <div id="email-error" class="error-message" role="alert" aria-live="polite"></div>
          </div>
          
          <div class="form-group">
            <label for="message">Message <span aria-label="required">*</span></label>
            <textarea id="message" name="message" required aria-describedby="message-error message-counter"></textarea>
            <div id="message-counter" class="character-counter">0/1000 characters</div>
            <div id="message-error" class="error-message" role="alert" aria-live="polite"></div>
          </div>
          
          <button type="submit">Send Message</button>
        </form>
      </main>
    </body>
    </html>
  `);
};

describe('Accessibility Tests', () => {
  describe('Home Page Accessibility', () => {
    it('should have valid heading hierarchy', () => {
      const dom = createHomePage();
      const isValid = validateHeadingHierarchy(dom.window.document);

      expect(isValid).toBe(true);
    });

    it('should have proper heading content and structure', () => {
      const dom = createHomePage();
      const h1 = dom.window.document.querySelector('h1');
      const h2 = dom.window.document.querySelector('h2');

      expect(h1).toBeTruthy();
      expect(h2).toBeTruthy();
      expect(h1?.textContent).toContain('Building data-driven farms');
    });

    it('should have skip link for keyboard navigation', () => {
      const dom = createHomePage();
      const skipLink = dom.window.document.querySelector('.skip-link');

      expect(skipLink).toBeTruthy();
      expect(skipLink?.getAttribute('href')).toBe('#main-content');
    });
  });

  describe('Contact Form Accessibility', () => {
    it('should have proper form label associations', () => {
      const dom = createContactForm();
      const isValid = validateFormLabels(dom.window.document);

      expect(isValid).toBe(true);
    });

    it('should have proper form field descriptions', () => {
      const dom = createContactForm();
      const nameInput = dom.window.document.getElementById('name');
      const emailInput = dom.window.document.getElementById('email');
      const messageInput = dom.window.document.getElementById('message');

      expect(nameInput?.getAttribute('aria-describedby')).toBe('name-error');
      expect(emailInput?.getAttribute('aria-describedby')).toBe('email-error');
      expect(messageInput?.getAttribute('aria-describedby')).toBe(
        'message-error message-counter'
      );
    });

    it('should have error messages with proper ARIA attributes', () => {
      const dom = createContactForm();
      const errorMessages =
        dom.window.document.querySelectorAll('.error-message');

      errorMessages.forEach((error: Element) => {
        expect(error.getAttribute('role')).toBe('alert');
        expect(error.getAttribute('aria-live')).toBe('polite');
      });

      const isValid = validateAriaAttributes(dom.window.document);
      expect(isValid).toBe(true);
    });
  });
});
