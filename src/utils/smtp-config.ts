// SMTP Configuration
export const smtpConfig = {
  host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(import.meta.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: import.meta.env.SMTP_USERNAME,
    pass: import.meta.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
};

export const emailConfig = {
  from: import.meta.env.SMTP_FROM_ADDRESS || 'noreply@agrxculture.com',
  to: import.meta.env.SMTP_USERNAME,
  baseUrl: import.meta.env.BASE_URL || 'http://localhost:4321'
};
