import * as nodemailer from 'nodemailer';

// Gmail configuration using App Passwords
// You need to generate an App Password from your Google Account
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  cc?: string
) => {
  try {
    const mailOptions: any = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
      replyTo: process.env.ADMIN_EMAIL
    };

    if (cc) {
      mailOptions.cc = cc;
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const getRegistrationEmailTemplate = (userName: string, userEmail: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">✨ Welcome to Maharshi Bhrigu Jyotish</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f7f4; border-radius: 0 0 10px 10px;">
        <p style="color: #333; font-size: 16px;">Dear <strong>${userName || 'User'}</strong>,</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Welcome! Your account has been successfully created. You are now ready to book spiritual consultation sessions with us.
        </p>
        
        <div style="background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0;">
          <h3 style="color: #8B4513; margin-top: 0;">Account Details</h3>
          <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Account Status:</strong> ✅ Active</p>
        </div>
        
        <h3 style="color: #8B4513; margin-top: 30px;">What's Next?</h3>
        <ol style="color: #555; font-size: 14px; line-height: 1.8;">
          <li>Log in to your account</li>
          <li>Browse our sacred services (Vedic Astrology, Kundali Analysis, etc.)</li>
          <li>Book a consultation session for ₹999</li>
          <li>Complete payment via Google Pay or PhonePe</li>
          <li>Receive confirmation and session details</li>
        </ol>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <p style="color: #856404; margin: 0; font-size: 13px;">
            <strong>🔒 Security Note:</strong> Never share your password. We will never ask for your password via email.
          </p>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.APP_URL}" style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          If you didn't create this account or have any questions, please contact us:
          <br><strong>📧 maharshibhrigujyotish@gmail.com</strong>
          <br><strong>📱 WhatsApp: +91 9158058080</strong>
        </p>
        
        <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
          © 2026 Maharshi Bhrigu Jyotish. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

export const getBookingConfirmationEmailTemplate = (bookingDetails: {
  userName: string;
  service: string;
  date: string;
  amount: number;
  paymentMethod: string;
  bookingId: string;
  notes?: string;
}) => {
  const { userName, service, date, amount, paymentMethod, bookingId, notes } = bookingDetails;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">✅ Booking Confirmed!</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f7f4; border-radius: 0 0 10px 10px;">
        <p style="color: #333; font-size: 16px;">Dear <strong>${userName}</strong>,</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Thank you for booking a consultation session with Maharshi Bhrigu Jyotish. Your payment has been received and processed successfully.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">📋 Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Booking ID:</strong></td>
              <td style="padding: 10px 0; text-align: right; color: #333;"><code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">${bookingId}</code></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Service:</strong></td>
              <td style="padding: 10px 0; text-align: right; color: #333;">${service}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Scheduled Date:</strong></td>
              <td style="padding: 10px 0; text-align: right; color: #333;">${new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Amount Paid:</strong></td>
              <td style="padding: 10px 0; text-align: right; color: #D4AF37; font-weight: bold;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>Payment Method:</strong></td>
              <td style="padding: 10px 0; text-align: right; color: #333;">${paymentMethod}</td>
            </tr>
          </table>
          ${notes ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;"><strong style="color: #666;">Your Notes:</strong><br><em style="color: #888;">"${notes}"</em></div>` : ''}
        </div>
        
        <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h4 style="color: #2e7d32; margin-top: 0;">⏭️ What Happens Next?</h4>
          <ul style="color: #555; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Our team will connect with you via WhatsApp</li>
            <li>Video call link will be shared 30 minutes before the session</li>
            <li>Session duration: 45 minutes</li>
            <li>You can use Hindi or Marathi</li>
          </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <p style="color: #856404; margin: 0; font-size: 13px;">
            <strong>📱 Need to reschedule or have questions?</strong> Contact us on WhatsApp: <strong>+91 9158058080</strong>
          </p>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.APP_URL}" style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View My Bookings
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          Thank you for choosing Maharshi Bhrigu Jyotish. We look forward to guiding you on your spiritual journey.
          <br><br>
          <strong>📧 Support:</strong> maharshibhrigujyotish@gmail.com
          <br><strong>📱 WhatsApp:</strong> +91 9158058080
        </p>
        
        <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
          © 2026 Maharshi Bhrigu Jyotish. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

export const getAdminBookingNotificationTemplate = (bookingDetails: {
  userName: string;
  userEmail: string;
  service: string;
  date: string;
  amount: number;
  paymentMethod: string;
  bookingId: string;
  notes?: string;
  timestamp: string;
}) => {
  const { userName, userEmail, service, date, amount, paymentMethod, bookingId, notes, timestamp } = bookingDetails;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🔔 New Booking Received</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f7f4; border-radius: 0 0 10px 10px;">
        <h2 style="color: #8B4513; margin-top: 0;">Admin Notification - Action Required</h2>
        
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666; width: 30%;"><strong>Name:</strong></td>
              <td style="padding: 10px 0; color: #333;">${userName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; color: #333;"><a href="mailto:${userEmail}" style="color: #D4AF37;">${userEmail}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Booking ID:</strong></td>
              <td style="padding: 10px 0; color: #333;"><code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">${bookingId}</code></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Service:</strong></td>
              <td style="padding: 10px 0; color: #333; font-weight: bold;">${service}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Scheduled Date:</strong></td>
              <td style="padding: 10px 0; color: #333;">${new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Amount:</strong></td>
              <td style="padding: 10px 0; color: #28a745; font-weight: bold;">₹${amount}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666;"><strong>Payment Method:</strong></td>
              <td style="padding: 10px 0; color: #333;">${paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>Booking Time:</strong></td>
              <td style="padding: 10px 0; color: #999; font-size: 13px;">${new Date(timestamp).toLocaleString('en-IN')}</td>
            </tr>
          </table>
          ${notes ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;"><strong style="color: #666;">Customer Notes:</strong><br><p style="color: #888; font-style: italic; margin: 5px 0;">"${notes}"</p></div>` : ''}
        </div>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1976d2;">
          <h4 style="color: #0d47a1; margin-top: 0;">📋 Action Items:</h4>
          <ul style="color: #555; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>☐ Confirm customer details</li>
            <li>☐ Schedule video call slot</li>
            <li>☐ Send WhatsApp message with session link (30 min before)</li>
            <li>☐ Conduct 45-minute consultation</li>
            <li>☐ Follow up with customer 24 hours later</li>
          </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <p style="color: #856404; margin: 0; font-size: 13px;">
            <strong>⚠️ Reminder:</strong> Respond to customer within 24 hours to confirm the session.
          </p>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FIREBASE_URL}/u/bookings" style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View Admin Panel
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          This is an automated notification. Please ensure customer satisfaction and timely delivery of services.
          <br><br>
          © 2026 Maharshi Bhrigu Jyotish. All rights reserved.
        </p>
      </div>
    </div>
  `;
};
