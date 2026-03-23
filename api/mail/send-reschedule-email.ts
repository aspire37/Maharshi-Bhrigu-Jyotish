import { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}

const auth = admin.auth();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

interface RescheduleEmailRequest {
  userEmail: string;
  userName: string;
  service: string;
  oldDate: string;
  newDate: string;
  bookingId: string;
}

function getRescheduleEmailTemplate(
  userName: string,
  service: string,
  oldDate: string,
  newDate: string,
  bookingId: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your Appointment Has Been Rescheduled</h2>
      <p>Dear ${userName},</p>
      <p>Your <strong>${service}</strong> appointment has been rescheduled.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Previous Date:</strong> <strike>${oldDate}</strike></p>
        <p><strong>New Date:</strong> <span style="color: #28a745; font-size: 18px;">${newDate}</span></p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
      </div>
      
      <p>If you have any questions, please contact us.</p>
      <p>Thank you!</p>
    </div>
  `;
}

function getAdminRescheduleNotification(
  userName: string,
  userEmail: string,
  service: string,
  oldDate: string,
  newDate: string,
  bookingId: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Rescheduled - Admin Alert</h2>
      <p><strong>Customer:</strong> ${userName}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Old Date:</strong> ${oldDate}</p>
      <p><strong>New Date:</strong> ${newDate}</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
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
    // Get Firebase ID token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!uid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Validate request body
    const {
      userEmail,
      userName,
      service,
      oldDate,
      newDate,
      bookingId,
    } = req.body as RescheduleEmailRequest;

    if (!userEmail || !userName || !service || !oldDate || !newDate || !bookingId) {
      return res.status(400).json({
        error:
          "Missing required fields: userEmail, userName, service, oldDate, newDate, bookingId",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "maharshibhrigujyotish@gmail.com";

    // Send emails in parallel
    const userEmailTemplate = getRescheduleEmailTemplate(
      userName,
      service,
      oldDate,
      newDate,
      bookingId
    );

    const adminEmailTemplate = getAdminRescheduleNotification(
      userName,
      userEmail,
      service,
      oldDate,
      newDate,
      bookingId
    );

    await Promise.all([
      transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: `Appointment Rescheduled - ${service}`,
        html: userEmailTemplate,
      }),
      transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: adminEmail,
        subject: `Booking Rescheduled - ${userName}`,
        html: adminEmailTemplate,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Rescheduling emails sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending reschedule email:", error);

    if (error.code === "auth/argument-error") {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    return res.status(500).json({
      error: "Failed to send reschedule emails",
      message: error.message,
    });
  }
}
