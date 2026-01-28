const { Resend } = require('resend');

// Initialize Resend client (skip if API key is "skip" or not provided)
const apiKey = process.env.RESEND_API_KEY;
const resend = (apiKey && apiKey !== 'skip')
  ? new Resend(apiKey)
  : null;

// Use Resend's test address for free tier, or your verified domain
const FROM_EMAIL = process.env.FROM_EMAIL || 'Lost Dane Found <onboarding@resend.dev>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Email templates
const templates = {
  itemReported: (firstName, itemName, referenceId) => ({
    subject: `Item Reported: ${itemName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Lost Dane Found</h1>
          <p style="color: #a8d4ff; margin: 10px 0 0;">Denmark High School</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1e3a5f;">Thanks for Reporting, ${firstName}!</h2>
          <p style="color: #4b5563;">Your found item has been logged in our system.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Item:</strong> ${itemName}</p>
            <p style="margin: 10px 0 0;"><strong>Reference ID:</strong> ${referenceId}</p>
          </div>
          <p style="color: #6b7280;">The rightful owner will be able to claim this item through our system. You'll be notified if there are any updates.</p>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: #a8d4ff; margin: 0; font-size: 14px;">Denmark High School Lost & Found</p>
        </div>
      </div>
    `
  }),

  claimSubmitted: (firstName, itemName, claimId) => ({
    subject: `Claim Submitted for: ${itemName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Lost Dane Found</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1e3a5f;">Claim Received, ${firstName}!</h2>
          <p style="color: #4b5563;">Your claim for <strong>${itemName}</strong> has been submitted for review.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Claim ID:</strong> ${claimId}</p>
            <p style="margin: 10px 0 0;"><strong>Status:</strong> Pending Review</p>
          </div>
          <p style="color: #6b7280;">An administrator will review your proof of ownership. You'll receive an email once a decision is made.</p>
        </div>
      </div>
    `
  }),

  claimApproved: (firstName, itemName, pickupLocation, pickupDate) => ({
    subject: `Claim Approved - Pick Up Your ${itemName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Claim Approved!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #059669;">Great News, ${firstName}!</h2>
          <p style="color: #4b5563;">Your claim for <strong>${itemName}</strong> has been approved!</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <p style="margin: 0;"><strong>Pickup Location:</strong> ${pickupLocation}</p>
            <p style="margin: 10px 0 0;"><strong>Pickup Date:</strong> ${pickupDate}</p>
          </div>
          <p style="color: #6b7280;">Please bring your student ID when picking up your item.</p>
        </div>
      </div>
    `
  }),

  claimDenied: (firstName, itemName, reason) => ({
    subject: `Claim Update for: ${itemName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Claim Not Approved</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #dc2626;">Hi ${firstName},</h2>
          <p style="color: #4b5563;">Unfortunately, your claim for <strong>${itemName}</strong> was not approved.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
          </div>
          <p style="color: #6b7280;">If you believe this was an error, please visit the Main Office with additional proof of ownership.</p>
        </div>
      </div>
    `
  }),

  matchFound: (firstName, itemName, matchScore, itemId, location, imageUrl) => ({
    subject: `Potential Match Found for Your Lost ${itemName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Potential Match Found!</h1>
          <p style="color: #e9d5ff; margin: 10px 0 0;">Lost Dane Found</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #7c3aed;">Great News, ${firstName}!</h2>
          <p style="color: #4b5563;">We may have found your lost item!</p>

          ${imageUrl ? `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${imageUrl}" alt="Found Item" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          </div>
          ` : ''}

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <p style="margin: 0;"><strong>Item:</strong> ${itemName}</p>
            <p style="margin: 10px 0 0;"><strong>Match Confidence:</strong> ${matchScore}%</p>
            <p style="margin: 10px 0 0;"><strong>Location Found:</strong> ${location}</p>
          </div>

          <p style="color: #4b5563; margin-bottom: 20px;">If this looks like your item, click below to view it and submit a claim.</p>

          <div style="text-align: center;">
            <a href="${FRONTEND_URL}/item/${itemId}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              View Item & Claim
            </a>
          </div>

          <p style="color: #6b7280; margin-top: 20px; font-size: 14px;">
            <strong>Remember:</strong> You'll need to provide proof of ownership when claiming.
            Describe unique features that only the owner would know.
          </p>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: #a8d4ff; margin: 0; font-size: 14px;">Denmark High School Lost & Found</p>
          <p style="color: #6b8db9; margin: 5px 0 0; font-size: 12px;">This is an automated notification based on AI matching.</p>
        </div>
      </div>
    `
  }),

  requestCreated: (firstName, itemName) => ({
    subject: `Lost Item Request Registered: ${itemName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Lost Dane Found</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1e3a5f;">Request Registered, ${firstName}!</h2>
          <p style="color: #4b5563;">Your lost item has been registered in our system.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Item:</strong> ${itemName}</p>
          </div>
          <p style="color: #4b5563;">We'll automatically notify you if someone reports finding a matching item!</p>
          <p style="color: #6b7280; font-size: 14px;">In the meantime, you can browse found items at <a href="${FRONTEND_URL}/browse" style="color: #1e3a5f;">lostdanefound.com/browse</a></p>
        </div>
      </div>
    `
  }),

  loginOTP: (firstName, otpCode) => ({
    subject: `Your Login Verification Code - ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Lost Dane Found</h1>
          <p style="color: #a8d4ff; margin: 10px 0 0;">Login Verification</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1e3a5f;">Hi ${firstName}!</h2>
          <p style="color: #4b5563;">Your login verification code is:</p>

          <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #1e3a5f;">
            <p style="margin: 0; font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #1e3a5f;">${otpCode}</p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>This code expires in 10 minutes.</strong> If you didn't request this code, please ignore this email.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px;">For security, never share this code with anyone.</p>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: #a8d4ff; margin: 0; font-size: 14px;">Denmark High School Lost & Found</p>
        </div>
      </div>
    `
  }),

  adminApproved: (firstName, securityCode) => ({
    subject: `Your Admin Account Has Been Approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Account Approved!</h1>
          <p style="color: #d1fae5; margin: 10px 0 0;">Lost Dane Found</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #059669;">Welcome, ${firstName}!</h2>
          <p style="color: #4b5563;">Your admin account has been approved by the site owner. You can now log in to the admin dashboard.</p>

          <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #059669;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your 6-Digit Admin Code</p>
            <p style="margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e3a5f;">${securityCode}</p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Important:</strong> Keep this code safe! You'll need it every time you log in to the admin dashboard. This code expires in 90 days.
            </p>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="${FRONTEND_URL}/admin/login" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Go to Admin Login
            </a>
          </div>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: #a8d4ff; margin: 0; font-size: 14px;">Denmark High School Lost & Found</p>
        </div>
      </div>
    `
  }),

  adminReactivated: (firstName, securityCode) => ({
    subject: `Your Admin Account Has Been Reactivated!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Account Reactivated!</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0;">Lost Dane Found</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #2563eb;">Welcome Back, ${firstName}!</h2>
          <p style="color: #4b5563;">Your admin account has been reactivated by the site owner. You can now log in to the admin dashboard again.</p>

          <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #2563eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your New 6-Digit Admin Code</p>
            <p style="margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e3a5f;">${securityCode}</p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Important:</strong> Keep this code safe! You'll need it every time you log in to the admin dashboard. This code expires in 90 days.
            </p>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="${FRONTEND_URL}/admin/login" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Go to Admin Login
            </a>
          </div>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: #a8d4ff; margin: 0; font-size: 14px;">Denmark High School Lost & Found</p>
        </div>
      </div>
    `
  }),

  passwordReset: (firstName, resetToken) => ({
    subject: `Reset Your Password - Lost Dane Found`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
          <p style="color: #a8d4ff; margin: 10px 0 0;">Lost Dane Found</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1e3a5f;">Hi ${firstName},</h2>
          <p style="color: #4b5563;">We received a request to reset your password. Click the button below to create a new password.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/reset-password/${resetToken}" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>This link expires in 1 hour.</strong> If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #1e3a5f; font-size: 12px; word-break: break-all;">${FRONTEND_URL}/reset-password/${resetToken}</p>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: #a8d4ff; margin: 0; font-size: 14px;">Denmark High School Lost & Found</p>
        </div>
      </div>
    `
  }),

  passwordResetSuccess: (firstName) => ({
    subject: `Your Password Has Been Reset - Lost Dane Found`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Changed</h1>
          <p style="color: #d1fae5; margin: 10px 0 0;">Lost Dane Found</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #059669;">Hi ${firstName},</h2>
          <p style="color: #4b5563;">Your password has been successfully reset. You can now log in with your new password.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Go to Login
            </a>
          </div>

          <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b; font-size: 14px;">
              <strong>Didn't make this change?</strong> If you didn't reset your password, please contact the school administration immediately.
            </p>
          </div>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: #a8d4ff; margin: 0; font-size: 14px;">Denmark High School Lost & Found</p>
        </div>
      </div>
    `
  })
};

/**
 * Send an email using a template
 * @param {string} to - Recipient email
 * @param {string} templateName - Name of the template to use
 * @param {Array} templateData - Array of arguments to pass to the template function
 */
const sendEmail = async (to, templateName, templateData) => {
  try {
    const template = templates[templateName];
    if (!template) {
      console.error(`Email template "${templateName}" not found`);
      return { success: false, error: 'Template not found' };
    }

    const { subject, html } = template(...templateData);

    // If Resend is not configured, log details for dev mode testing
    if (!resend) {
      console.log(`\n========== [DEV MODE EMAIL] ==========`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Template: ${templateName}`);
      // For OTP emails, extract and display the code prominently
      if (templateName === 'loginOTP' && templateData[1]) {
        console.log(`\n>>> OTP CODE: ${templateData[1]} <<<\n`);
      }
      console.log(`======================================\n`);
      return { success: true, dev: true, templateData };
    }

    // Send via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: subject,
      html: html
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log(`Email sent to ${to}: ${subject}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Send email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a raw HTML email
 */
const sendRawEmail = async (to, subject, html) => {
  try {
    if (!resend) {
      console.log(`[DEV] Raw email to: ${to}, Subject: ${subject}`);
      return { success: true, dev: true };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: subject,
      html: html
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Send raw email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send match notification emails to all matching request owners
 * @param {object} foundItem - The newly found item
 * @param {Array} matches - Array of matching requests with scores
 */
const sendMatchNotifications = async (foundItem, matches) => {
  const results = [];

  for (const match of matches) {
    const { request, score } = match;

    try {
      const result = await sendEmail(
        request.email,
        'matchFound',
        [
          request.first_name,
          foundItem.name,
          Math.round(score),
          foundItem.id,
          request.location_name || 'See item details',
          foundItem.image_url
        ]
      );

      results.push({
        requestId: request.id,
        email: request.email,
        success: result.success
      });

      // Small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to send match notification to ${request.email}:`, error);
      results.push({
        requestId: request.id,
        email: request.email,
        success: false,
        error: error.message
      });
    }
  }

  return results;
};

module.exports = {
  sendEmail,
  sendRawEmail,
  sendMatchNotifications,
  templates
};
