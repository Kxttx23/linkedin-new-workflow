import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`❌ Missing environment variable: ${key}`);
  return value;
}

export const PORT = Number(process.env.PORT) || 3000;
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
export const APPROVER_EMAIL = required('APPROVER_EMAIL');

export const GMAIL = {
  clientId: required('GMAIL_CLIENT_ID'),
  clientSecret: required('GMAIL_CLIENT_SECRET'),
  refreshToken: required('GMAIL_REFRESH_TOKEN'),
};

export const GEMINI_API_KEY = required('GEMINI_API_KEY');

export const LINKEDIN = {
  accessToken: required('LINKEDIN_ACCESS_TOKEN'),
  personUrn: process.env.LINKEDIN_PERSON_URN || '',
  orgUrn: process.env.LINKEDIN_ORG_URN || '',
  version: process.env.LINKEDIN_VERSION || '202608',
};