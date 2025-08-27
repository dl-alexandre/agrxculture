# Contact Form Setup Guide

This guide explains how to configure the contact form with Formspree and reCAPTCHA for production use.

## Formspree Configuration

### 1. Create Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form project

### 2. Get Form Endpoint
1. In your Formspree dashboard, create a new form
2. Copy the form endpoint URL (e.g., `https://formspree.io/f/xpznvqjr`)
3. Replace `YOUR_FORM_ID` in `src/pages/contact.astro` with your actual form ID

### 3. Configure Form Settings
In your Formspree dashboard:
- **Form Name**: Agricultural Technology Inquiries
- **Redirect URL**: Leave blank (handled by JavaScript)
- **Email Notifications**: Enable
- **Spam Protection**: Enable (includes honeypot)

### 4. Update Contact Form
Replace the form action in `src/pages/contact.astro`:
```html
<form 
  id="contact-form" 
  class="contact-form"
  action="https://formspree.io/f/YOUR_ACTUAL_FORM_ID"
  method="POST"
  novalidate
>
```

## reCAPTCHA v3 Configuration

### 1. Get reCAPTCHA Keys
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site with reCAPTCHA v3
3. Add your domain(s) to the allowed domains list
4. Copy the Site Key and Secret Key

### 2. Update Site Key
Replace `YOUR_RECAPTCHA_SITE_KEY` in `src/pages/contact.astro`:
```html
<div class="g-recaptcha" data-sitekey="YOUR_ACTUAL_SITE_KEY"></div>
```

### 3. Configure Formspree Integration
1. In your Formspree dashboard, go to Integration settings
2. Add reCAPTCHA Secret Key to enable server-side verification
3. Enable reCAPTCHA protection for your form

## Environment Variables (Optional)

For better security, you can use environment variables:

### 1. Create `.env` file
```env
PUBLIC_FORMSPREE_FORM_ID=your_form_id_here
PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

### 2. Update Astro Configuration
In `src/pages/contact.astro`, use environment variables:
```javascript
---
const formspreeId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID;
const recaptchaSiteKey = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;
---
```

### 3. Update Form HTML
```html
<form 
  action={`https://formspree.io/f/${formspreeId}`}
  method="POST"
>
  <!-- form fields -->
  <div class="g-recaptcha" data-sitekey={recaptchaSiteKey}></div>
</form>
```

## Testing

### 1. Local Testing
- Use test mode in Formspree (submissions won't be sent)
- Test form validation with various inputs
- Verify error handling and success states

### 2. Production Testing
- Submit a test form with valid data
- Check email delivery
- Verify spam protection is working
- Test on mobile devices

## Spam Protection Features

The contact form includes multiple layers of spam protection:

1. **Honeypot Field**: Hidden field that bots typically fill out
2. **Client-side Validation**: Prevents obviously invalid submissions
3. **reCAPTCHA v3**: Google's invisible spam protection
4. **Formspree Built-in Protection**: Server-side spam filtering
5. **Rate Limiting**: Formspree automatically rate limits submissions

## Accessibility Features

The form includes comprehensive accessibility features:

- **ARIA Labels**: All form fields have proper labels
- **Error Announcements**: Screen readers announce validation errors
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators and management
- **High Contrast Support**: Works with high contrast mode
- **Reduced Motion**: Respects user motion preferences

## Analytics Integration

To track form submissions in Google Analytics:

1. Add Google Analytics to your site
2. The contact form script automatically tracks successful submissions
3. Events are sent as 'form_submit' with category 'Contact'

## Troubleshooting

### Common Issues

1. **Form not submitting**: Check Formspree endpoint URL
2. **reCAPTCHA not loading**: Verify site key and domain configuration
3. **Emails not received**: Check Formspree email settings and spam folder
4. **Validation errors**: Check browser console for JavaScript errors

### Debug Mode

To enable debug logging, add to your browser console:
```javascript
localStorage.setItem('contact-form-debug', 'true');
```

This will log form validation and submission details to the console.

## Security Considerations

1. **HTTPS Only**: Ensure your site uses HTTPS in production
2. **CSP Headers**: Configure Content Security Policy to allow Formspree and reCAPTCHA
3. **Rate Limiting**: Formspree provides built-in rate limiting
4. **Data Privacy**: Review Formspree and Google's privacy policies
5. **GDPR Compliance**: Add privacy notice if required for your jurisdiction

## Maintenance

### Regular Tasks
- Monitor form submissions in Formspree dashboard
- Review spam protection effectiveness
- Update reCAPTCHA keys if needed
- Test form functionality monthly

### Updates
- Keep Formspree integration updated
- Monitor for new spam protection features
- Update accessibility features as standards evolve