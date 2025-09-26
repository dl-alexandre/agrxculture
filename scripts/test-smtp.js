#!/usr/bin/env node

/**
 * SMTP Configuration Test
 * Tests the SMTP connection and email sending capability
 */

import nodemailer from 'nodemailer';

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
};

async function testSMTPConnection() {
  // Validate required environment variables
  if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
    console.log('❌ SMTP credentials not configured');
    console.log('Please set the following environment variables:');
    console.log('- SMTP_USERNAME');
    console.log('- SMTP_PASSWORD');
    console.log('- SMTP_FROM_ADDRESS (optional)');
    return;
  }

  console.log('Testing SMTP Connection...');
  console.log('========================');
  console.log(`Host: ${smtpConfig.host}`);
  console.log(`Port: ${smtpConfig.port}`);
  console.log(`Username: ${smtpConfig.auth.user}`);
  console.log(`Password: ${'*'.repeat(smtpConfig.auth.pass.length)}`);
  console.log('');

  try {
    const transporter = nodemailer.createTransport(smtpConfig);
    
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('\nTesting email sending...');
    const testEmail = {
      from: process.env.SMTP_FROM_ADDRESS || 'noreply@agrxculture.com',
      to: process.env.SMTP_USERNAME,
      subject: 'SMTP Test - Agrxculture Contact Form',
      text: 'This is a test email to verify SMTP configuration.',
      html: `
        <h2>SMTP Test Successful!</h2>
        <p>Your Agrxculture contact form SMTP configuration is working correctly.</p>
        <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Configuration:</strong></p>
        <ul>
          <li>Host: ${smtpConfig.host}</li>
          <li>Port: ${smtpConfig.port}</li>
          <li>Username: ${smtpConfig.auth.user}</li>
        </ul>
      `
    };
    
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Response: ${info.response}`);
    
  } catch (error) {
    console.log('❌ SMTP test failed:');
    console.log(`Error: ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Error - Possible fixes:');
      console.log('1. Check Gmail App Password is correct');
      console.log('2. Verify 2-Factor Authentication is enabled');
      console.log('3. Ensure SMTP_USERNAME is correct');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Connection Error - Possible fixes:');
      console.log('1. Check SMTP_HOST and SMTP_PORT');
      console.log('2. Verify network connectivity');
      console.log('3. Check firewall settings');
    }
  }
}

async function main() {
  // Load environment variables if .env file exists
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch (e) {
    console.log('Note: dotenv not available, using default values');
  }

  await testSMTPConnection();
}

main().catch(console.error);
