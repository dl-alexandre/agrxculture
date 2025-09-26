export const prerender = false;

import nodemailer from 'nodemailer';
import { smtpConfig, emailConfig } from '../../utils/smtp-config';

export async function GET() {
  return new Response(JSON.stringify({
    message: 'Contact API endpoint is working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST({ request }: { request: Request }) {
  try {
    // Validate SMTP configuration
    if (!import.meta.env.SMTP_USERNAME || !import.meta.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured');
      return new Response(JSON.stringify({
        error: 'Email service not configured'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const projectType = formData.get('project-type') as string;
    const message = formData.get('message') as string;
    
    // Validate required fields
    if (!name || !email || !projectType || !message) {
      return new Response(JSON.stringify({
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport(smtpConfig);
    
    // Verify SMTP connection
    await transporter.verify();
    
    // Email content
    const subject = `New Agrxculture Technology Inquiry from ${name}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5530; border-bottom: 2px solid #2c5530; padding-bottom: 10px;">
          New Agricultural Technology Inquiry
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5530; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${company ? `<p><strong>Company/Farm:</strong> ${company}</p>` : ''}
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5530; margin-top: 0;">Project Details</h3>
          <p><strong>Project Type:</strong> ${getProjectTypeLabel(projectType)}</p>
        </div>
        
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5530; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #666;">
          <p><strong>Response Instructions:</strong></p>
          <p>• Reply directly to this email to respond to ${name}</p>
          <p>• Agrxculture typically responds within 24-48 hours</p>
          <p>• This inquiry was submitted via the Agrxculture contact form</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          This email was sent from the Agrxculture contact form<br>
          <a href="${emailConfig.baseUrl}/contact" style="color: #2c5530;">Visit Agrxculture Website</a>
        </p>
      </div>
    `;
    
    const textContent = `
New Agrxculture Technology Inquiry

Contact Information:
- Name: ${name}
- Email: ${email}
${company ? `- Company/Farm: ${company}` : ''}

Project Details:
- Project Type: ${getProjectTypeLabel(projectType)}

Message:
${message}

---
This inquiry was submitted via the Agrxculture contact form.
Reply directly to this email to respond to ${name}.
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: email,
      subject: subject,
      text: textContent,
      html: htmlContent
    });
    
    console.log('Email sent successfully:', info.messageId);
    
    return new Response(JSON.stringify({
      success: true,
      messageId: info.messageId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

function getProjectTypeLabel(projectType: string): string {
  const labels: Record<string, string> = {
    'iot-integration': 'IoT Integration & Sensors',
    'mobile-app': 'Mobile Farm Management App',
    'data-analytics': 'Agricultural Data Analytics',
    'api-development': 'API Development & Integration',
    'automation': 'Farm Automation Systems',
    'custom-solution': 'Custom Solution',
    'consultation': 'Technology Consultation'
  };
  
  return labels[projectType] || projectType;
}