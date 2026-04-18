import { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

// Email template for admin
function getAdminEmailTemplate(data: ContactRequest): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h2 style="margin: 0;">New Contact Form Submission</h2>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;"><strong>New contact inquiry received from your website</strong></p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 10px 0;"><strong>📝 Name:</strong> ${data.name}</p>
          <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p style="margin: 10px 0;"><strong>📱 Phone:</strong> ${data.phone}</p>
          <p style="margin: 10px 0;"><strong>🎯 Service Interested In:</strong> ${data.service}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin-bottom: 10px;"><strong>💬 Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px; color: #555; line-height: 1.6;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
        </p>
        
        <div style="background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
          <p style="margin: 0; color: #0066cc; font-size: 14px;">
            <strong>Quick Reply</strong><br>
            Email: <a href="mailto:${data.email}">${data.email}</a><br>
            Phone: <a href="tel:${data.phone}">${data.phone}</a>
          </p>
        </div>
        
        <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
          <p style="margin: 5px 0;">This is an automated email from your website contact form.</p>
          <p style="margin: 5px 0;">Do not reply to this email directly.</p>
        </footer>
      </div>
    </div>
  `;
}

// Email template for customer
function getCustomerEmailTemplate(name: string, service: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h2 style="margin: 0;">Thank You for Your Interest</h2>
        <p style="margin: 5px 0; font-size: 14px;">Maharshi Bhrigu Jyotish</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>
        
        <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
          Thank you for reaching out to us regarding <strong>${service}</strong>. We appreciate your interest in our spiritual services.
        </p>
        
        <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
          We have received your message and will review it shortly. Our team will get back to you within 24 hours with detailed information about your inquiry.
        </p>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #0066cc;"><strong>📱 Need immediate assistance?</strong></p>
          <p style="margin: 10px 0; color: #555;">
            You can reach us on WhatsApp at <strong>+91 9158058080</strong> for faster response.
          </p>
        </div>
        
        <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
          In the meantime, feel free to explore our YouTube channel for spiritual insights and guidance.
        </p>
        
        <p style="color: #555; line-height: 1.6; margin-top: 30px;">
          Warm regards,<br>
          <strong>Maharshi Bhrigu Jyotish Team</strong>
        </p>
        
        <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
          <p style="margin: 5px 0;">© 2024 Maharshi Bhrigu Jyotish. All rights reserved.</p>
          <p style="margin: 5px 0;">
            <a href="https://www.youtube.com/channel/UCrMTsdBcuo_pqV89hLJs_yA" style="color: #667eea; text-decoration: none;">Visit Our YouTube Channel</a>
          </p>
        </footer>
      </div>
    </div>
  `;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate request body
    const { name, email, phone, service, message } = req.body as ContactRequest;

    // Validation
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "email", "phone", "service", "message"],
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Validate phone format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        error: "Message must be at least 10 characters long",
      });
    }

    // Send email to admin
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "maharshibhrigujyotish@gmail.com",
      subject: `New Contact Form Submission - ${name} (${service})`,
      html: getAdminEmailTemplate({ name, email, phone, service, message }),
      replyTo: email,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Maharshi Bhrigu Jyotish",
      html: getCustomerEmailTemplate(name, service),
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We will contact you soon!",
    });
  } catch (error: any) {
    console.error("Error processing contact form:", error);

    return res.status(500).json({
      error: "Failed to process your request",
      message: error.message,
    });
  }
}
