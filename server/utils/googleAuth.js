const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google ID token and extract user information
 * @param {string} credential - The Google ID token from the client
 * @returns {Promise<Object>} - User info from Google (email, name, googleId, picture)
 */
async function verifyGoogleToken(credential) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      picture: payload.picture || null,
      fullName: payload.name || ''
    };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error('Invalid Google token');
  }
}

/**
 * Validate that the email domain is allowed
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if the email domain is allowed
 */
function isAllowedEmailDomain(email) {
  const allowedDomains = [
    '@forsythk12.org',
    '@students.forsythk12.org',
    '@gmail.com'
  ];

  return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
}

module.exports = {
  verifyGoogleToken,
  isAllowedEmailDomain
};
