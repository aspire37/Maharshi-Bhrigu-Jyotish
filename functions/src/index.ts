import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  sendEmail,
  getRegistrationEmailTemplate,
  getBookingConfirmationEmailTemplate,
  getAdminBookingNotificationTemplate
} from './emails';

// Initialize Firebase Admin SDK
admin.initializeApp();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'maharshibhrigujyotish@gmail.com';
const APP_URL = process.env.APP_URL || 'https://maharshi-bhrigu-jyotish.web.app';

// ============================================
// FUNCTION 1: Send Welcome Email on User Registration
// ============================================
export const sendRegistrationEmail = functions.auth.user().onCreate(async (user) => {
  try {
    console.log('New user registered:', user.email);

    const userName = user.displayName || user.email?.split('@')[0] || 'User';
    const emailTemplate = getRegistrationEmailTemplate(userName, user.email!);

    await sendEmail(
      user.email!,
      '✨ Welcome to Maharshi Bhrigu Jyotish - Account Created Successfully',
      emailTemplate
    );

    console.log('Welcome email sent to:', user.email);
  } catch (error) {
    console.error('Error sending registration email:', error);
    // Don't throw - user registration should succeed even if email fails
  }
});

// ============================================
// FUNCTION 2: Send Booking Confirmation Email to User
// ============================================
export const sendBookingConfirmationEmail = functions.firestore
  .document('payments/{paymentId}')
  .onCreate(async (snap) => {
    try {
      const paymentData = snap.data();

      console.log('New booking created:', snap.id);

      const bookingDetails = {
        userName: paymentData.userName,
        service: paymentData.service,
        date: paymentData.bookingDate,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        bookingId: snap.id,
        notes: paymentData.additionalNotes
      };

      // Send confirmation email to user
      const userEmailTemplate = getBookingConfirmationEmailTemplate(bookingDetails);

      await sendEmail(
        paymentData.userEmail,
        '✅ Booking Confirmed - Your Consultation Session is Scheduled',
        userEmailTemplate
      );

      console.log('Booking confirmation email sent to:', paymentData.userEmail);

      // Send notification email to admin
      const adminEmailTemplate = getAdminBookingNotificationTemplate({
        ...bookingDetails,
        userEmail: paymentData.userEmail,
        timestamp: paymentData.transactionDate
      });

      await sendEmail(
        ADMIN_EMAIL,
        `🔔 New Booking Received - ${paymentData.service} from ${paymentData.userName}`,
        adminEmailTemplate
      );

      console.log('Admin notification email sent');

    } catch (error) {
      console.error('Error sending booking emails:', error);
      // Log error but don't fail the function
    }
  });

// ============================================
// FUNCTION 3: Send Custom Email to User (via Callable Function)
// ============================================
export const sendCustomEmail = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  try {
    const { to, subject, html } = data;

    if (!to || !subject || !html) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: to, subject, html'
      );
    }

    await sendEmail(to, subject, html);

    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to send email'
    );
  }
});

// ============================================
// FUNCTION 4: Reschedule Booking Email
// ============================================
export const sendRescheduleEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  try {
    const { userEmail, userName, service, oldDate, newDate, bookingId } = data;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📅 Booking Rescheduled</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f7f4; border-radius: 0 0 10px 10px;">
          <p style="color: #333; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Your booking has been successfully rescheduled.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #D4AF37;">
            <h3 style="color: #8B4513; margin-top: 0;">Updated Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #666;"><strong>Service:</strong></td>
                <td style="padding: 10px 0; text-align: right; color: #333;">${service}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #666;"><strong>Old Date:</strong></td>
                <td style="padding: 10px 0; text-align: right; color: #999; text-decoration: line-through;">${new Date(oldDate).toLocaleDateString('en-IN')}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #666;"><strong>New Date:</strong></td>
                <td style="padding: 10px 0; text-align: right; color: #28a745; font-weight: bold;">${new Date(newDate).toLocaleDateString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Booking ID:</strong></td>
                <td style="padding: 10px 0; text-align: right; color: #333;"><code style="background: #f0f0f0; padding: 5px 10px;">${bookingId}</code></td>
              </tr>
            </table>
          </div>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Our team will contact you with the updated session details via WhatsApp.
          </p>
        </div>
      </div>
    `;

    await sendEmail(
      userEmail,
      '📅 Your Booking Has Been Rescheduled',
      emailTemplate
    );

    // Notify admin
    const adminTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Admin Alert: Booking Rescheduled</h2>
        <p><strong>Customer:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Old Date:</strong> ${new Date(oldDate).toLocaleDateString('en-IN')}</p>
        <p><strong>New Date:</strong> ${new Date(newDate).toLocaleDateString('en-IN')}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
      </div>
    `;

    await sendEmail(
      ADMIN_EMAIL,
      `Admin Alert: Booking Rescheduled - ${userName}`,
      adminTemplate
    );

    return {
      success: true,
      message: 'Rescheduling emails sent successfully'
    };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to send reschedule email'
    );
  }
});

console.log('Cloud Functions initialized successfully');
