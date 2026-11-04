import { BASE_URL } from '../config/env';

export const dailyFormEmail = (dayNumber: number, totalDays: number) => `
  <p>Hi! Time for your Day ${dayNumber}/${totalDays} LinkedIn post.</p>
  <p><a href="${BASE_URL}/form?day=${dayNumber}">Click here to tell me what you learned today</a></p>
`;