import { BASE_URL } from '../config/env';

export const approvalEmail = (postText: string, token: string, dayNumber: number) => `
  <h2>Day ${dayNumber} LinkedIn Post — Approve?</h2>
  <pre style="background:#f4f4f4;padding:15px;white-space:pre-wrap;">${postText}</pre>
  <p>
    <a href="${BASE_URL}/approve?token=${token}&action=approve" style="padding:10px 20px;background:green;color:white;text-decoration:none;">✅ Approve & Post</a>
    <a href="${BASE_URL}/approve?token=${token}&action=decline" style="padding:10px 20px;background:red;color:white;text-decoration:none;margin-left:10px;">🚫 Decline</a>
  </p>
`;