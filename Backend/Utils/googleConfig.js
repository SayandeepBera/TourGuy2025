import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Ensure that the Google Client ID and Secret are set in environment variables
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google Client ID and Secret must be set in environment variables.");
}

export const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET,
    'postmessage'
);