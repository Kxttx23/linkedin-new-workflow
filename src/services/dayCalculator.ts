import { START_DATE, TOTAL_DAYS } from '../config/constants';

export function getCurrentDayNumber(): number {
  const start = new Date(START_DATE + 'T00:00:00+05:30');
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export function isChallengeComplete(): boolean {
  return getCurrentDayNumber() > TOTAL_DAYS;
}