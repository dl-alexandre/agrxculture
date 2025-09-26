import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock the contact form functionality
const createContactForm = () => {
  const dom = new JSDOM(`
    <form id="contact-form" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contact" />
      <div style="display: none;">
        <input name="bot-field" />
      </div>
      
      <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" id="name" name="name" required />
        <span class="error-message" id="name-error"></span>
      </div>
      
      <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" required />
        <span class="error-message" id="email-error"></span>
      </div>
      
      <div class="form-group">
        <label for="company">Company</label>
        <input type="text" id="company" name="company" />
      </div>
      
      <div class="form-group">
        <label for="project-type">Project Type</label>
        <select id="project-type" name="project-type">
          <option value="">Select a project type</option>
          <option value="iot-integration">IoT Integration</option>
          <option value="mobile-app">Mobile App</option>
          <option value="data-analytics">Data Analytics</option>
          <option value="api-development">API Development</option>
          <option value="custom-solution">Custom Solution</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="message">Message *</label>
        <textarea id="message" name="message" required maxlength="2000"></textarea>
        <span class="character-counter" id="message-counter">0/2000</span>
        <span class="error-message" id="message-error"></span>
      </div>
      
      <button type="submit" id="submit-btn">
        <span class="btn-text">Send Message</span>
        <span class="loading-spinner" style="display: none;">Sending...</span>
      </button>
      
      <div id="form-success" style="display: none;">
        <p>Thank you for your message! I'll respond within 24-48 hours.</p>
      </div>
      
      <div id="form-error" style="display: none;">
        <p>There was an error sending your message. Please try again.</p>
      </div>
    </form>
  `);

  return dom.window.document;
};

// Form validation functions (extracted from contact-form.js)
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

const validateMessageLength = (message: string): boolean => {
  return message.length <= 2000;
};

const showError = (
  document: Document,
  fieldId: string,
  message: string
): void => {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
};

const clearError = (document: Document, fieldId: string): void => {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
};

describe('Contact Form Validation', () => {
  let document: Document;

  beforeEach(() => {
    document = createContactForm();
    vi.clearAllMocks();
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('farmer@agricultural-solutions.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test.domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('Required Field Validation', () => {
    it('should validate non-empty required fields', () => {
      expect(validateRequired('John Doe')).toBe(true);
      expect(validateRequired('  Valid Name  ')).toBe(true);
    });

    it('should reject empty or whitespace-only fields', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired('\t\n')).toBe(false);
    });
  });

  describe('Message Length Validation', () => {
    it('should accept messages within character limit', () => {
      expect(validateMessageLength('Short message')).toBe(true);
      expect(validateMessageLength('A'.repeat(2000))).toBe(true);
    });

    it('should reject messages exceeding character limit', () => {
      expect(validateMessageLength('A'.repeat(2001))).toBe(false);
    });
  });

  describe('Form Error Display', () => {
    it('should show error messages correctly', () => {
      showError(document, 'name', 'Name is required');

      const errorElement = document.getElementById('name-error');
      expect(errorElement?.textContent).toBe('Name is required');
      expect(errorElement?.style.display).toBe('block');
    });

    it('should clear error messages correctly', () => {
      // First show an error
      showError(document, 'email', 'Invalid email format');

      // Then clear it
      clearError(document, 'email');

      const errorElement = document.getElementById('email-error');
      expect(errorElement?.textContent).toBe('');
      expect(errorElement?.style.display).toBe('none');
    });
  });

  describe('Form Structure', () => {
    it('should have all required form elements', () => {
      expect(document.getElementById('contact-form')).toBeTruthy();
      expect(document.getElementById('name')).toBeTruthy();
      expect(document.getElementById('email')).toBeTruthy();
      expect(document.getElementById('message')).toBeTruthy();
      expect(document.getElementById('submit-btn')).toBeTruthy();
    });

    it('should have proper accessibility attributes', () => {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      expect(nameInput?.getAttribute('required')).toBe('');
      expect(emailInput?.getAttribute('type')).toBe('email');
      expect(emailInput?.getAttribute('required')).toBe('');
      expect(messageInput?.getAttribute('required')).toBe('');
      expect(messageInput?.getAttribute('maxlength')).toBe('2000');
    });

    it('should have honeypot field for spam protection', () => {
      const honeypotField = document.querySelector('input[name="bot-field"]');
      expect(honeypotField).toBeTruthy();
      expect(honeypotField?.parentElement?.style.display).toBe('none');
    });
  });
});
