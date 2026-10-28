import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { GMAIL, APPROVER_EMAIL } from '../config/env';
import { approvalEmail } from '../templates/approvalEmail';
import { dailyFormEmail } from '../templates/dailyFormEmail';

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(GMAIL.clientId, GMAIL.clientSecret, "https://developers.google.com/oauthplayground");
oauth2Client.setCredentials({ refresh_token: GMAIL.refreshToken });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: APPROVER_EMAIL,
    clientId: GMAIL.clientId,
    clientSecret: GMAIL.clientSecret,
    refreshToken: GMAIL.refreshToken,
    accessToken: oauth2Client.getAccessToken(),
  },
} as any);

export async function sendDailyForm(to: string, dayNumber: number, totalDays: number) {
  await transporter.sendMail({
    from: APPROVER_EMAIL,
    to,
    subject: `Day ${dayNumber}/${totalDays}: what did you learn today?`,
    html: dailyFormEmail(dayNumber, totalDays),
  });
}

export async function sendApprovalEmail(to: string, postText: string, dayNumber: number): Promise<string> {
  const token = Buffer.from(`${dayNumber}-${Date.now()}`).toString('base64');
  await transporter.sendMail({
    from: APPROVER_EMAIL,
    to,
    subject: `Approve your Day ${dayNumber} LinkedIn post`,
    html: approvalEmail(postText, token, dayNumber),
  });
  return token;
}