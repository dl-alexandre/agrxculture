/**
 * Contact Form Handler
 * Handles form validation, submission, and user interactions
 */

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitBtn = document.getElementById('submit-btn');
    this.messageTextarea = document.getElementById('message');
    this.messageCounter = document.getElementById('message-counter');
    
    if (!this.form) return;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCharacterCounter();
    this.setupRecaptcha();
  }

  setupEventListeners() {
    // Character counter for message field
    this.messageTextarea.addEventListener('input', () => this.updateCharacterCounter());
    
    // Real-time validation
    const formFields = this.form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          this.validateField(field);
        }
      });
    });

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  updateCharacterCounter() {
    const currentLength = this.messageTextarea.value.length;
    const maxLength = 2000;
    this.messageCounter.textContent = `${currentLength} / ${maxLength} characters`;
    
    if (currentLength > maxLength * 0.9) {
      this.messageCounter.classList.add('warning');
    } else {
      this.messageCounter.classList.remove('warning');
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    errorElement.textContent = '';
    field.classList.remove('error');

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
      isValid = false;
    }
    // Email validation
    else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address.';
        isValid = false;
      }
    }
    // Select validation
    else if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
      errorMessage = 'Please select a project type.';
      isValid = false;
    }
    // Message length validation
    else if (field.id === 'message' && value.length > 2000) {
      errorMessage = 'Message must be 2000 characters or less.';
      isValid = false;
    }
    // Name validation (basic)
    else if (field.id === 'name' && value && value.length < 2) {
      errorMessage = 'Please enter your full name.';
      isValid = false;
    }

    if (!isValid) {
      errorElement.textContent = errorMessage;
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.setAttribute('aria-invalid', 'false');
    }

    return isValid;
  }

  getFieldLabel(fieldName) {
    const labels = {
      'name': 'Full Name',
      'email': 'Email Address',
      'company': 'Company/Farm Name',
      'project-type': 'Project Type',
      'message': 'Project Details'
    };
    return labels[fieldName] || fieldName;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const formFields = this.form.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    formFields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    // Check reCAPTCHA if enabled
    if (window.grecaptcha && typeof grecaptcha.getResponse === 'function') {
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        document.getElementById('recaptcha-error').textContent = 'Please complete the reCAPTCHA verification.';
        isFormValid = false;
      } else {
        document.getElementById('recaptcha-error').textContent = '';
      }
    }

    if (!isFormValid) {
      // Focus on first error field
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      const formData = new FormData(this.form);
      
      // Add additional metadata for Formspree
      formData.append('_subject', 'New Agrxculture Technology Inquiry');
      formData.append('_replyto', formData.get('email'));
      formData.append('_next', window.location.href + '#success');
      
      // Add reCAPTCHA response if available
      if (window.grecaptcha && typeof grecaptcha.getResponse === 'function') {
        formData.append('g-recaptcha-response', grecaptcha.getResponse());
      }
      
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.showSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(error.message);
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitBtn.classList.add('loading');
      this.submitBtn.disabled = true;
      this.submitBtn.setAttribute('aria-busy', 'true');
    } else {
      this.submitBtn.classList.remove('loading');
      this.submitBtn.disabled = false;
      this.submitBtn.setAttribute('aria-busy', 'false');
    }
  }

  showSuccess() {
    document.getElementById('form-success').style.display = 'block';
    document.getElementById('form-error').style.display = 'none';
    
    // Reset form
    this.form.reset();
    this.updateCharacterCounter();
    
    // Reset reCAPTCHA if available
    if (window.grecaptcha && typeof grecaptcha.reset === 'function') {
      grecaptcha.reset();
    }
    
    // Clear any error states
    const errorFields = this.form.querySelectorAll('.error');
    errorFields.forEach(field => {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
    });
    
    // Clear error messages
    const errorMessages = this.form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
    
    // Scroll to success message
    document.getElementById('form-success').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });

    // Analytics tracking (if available)
    if (typeof gtag === 'function') {
      gtag('event', 'form_submit', {
        event_category: 'Contact',
        event_label: 'Agrxculture Technology Inquiry'
      });
    }
  }

  showError(errorMessage = null) {
    const errorElement = document.getElementById('form-error');
    document.getElementById('form-error').style.display = 'block';
    document.getElementById('form-success').style.display = 'none';
    
    // Update error message if provided
    if (errorMessage) {
      const errorText = errorElement.querySelector('p');
      if (errorText) {
        errorText.innerHTML = `There was an issue sending your message: ${errorMessage}. Please try again or contact us directly at <a href="mailto:contact@agrxculture.com">contact@agrxculture.com</a>`;
      }
    }
    
    // Scroll to error message
    errorElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }

  setupRecaptcha() {
    // Hide reCAPTCHA container initially since it needs proper setup
    const recaptchaContainer = document.querySelector('.recaptcha-container');
    if (recaptchaContainer) {
      // Check if reCAPTCHA site key is configured
      const siteKey = recaptchaContainer.querySelector('.g-recaptcha')?.getAttribute('data-sitekey');
      if (!siteKey || siteKey === 'YOUR_RECAPTCHA_SITE_KEY') {
        recaptchaContainer.style.display = 'none';
      } else {
        // Load reCAPTCHA script if site key is configured
        this.loadRecaptchaScript();
      }
    }
  }

  loadRecaptchaScript() {
    if (document.querySelector('script[src*="recaptcha"]')) {
      return; // Already loaded
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactForm;
}