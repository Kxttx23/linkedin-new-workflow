import cron from 'node-cron';
import { CRON_SCHEDULE, TIMEZONE, TOTAL_DAYS } from '../config/constants';
import { getCurrentDayNumber, isChallengeComplete } from '../services/dayCalculator';
import { sendDailyForm } from '../services/emailService';
import { APPROVER_EMAIL } from '../config/env';
import { logger } from '../utils/logger';

export function startDailyJob() {
  cron.schedule(CRON_SCHEDULE, async () => {
    logger.info('⏰ Daily job triggered');
    if (isChallengeComplete()) {
      logger.info('🎉 Challenge complete!');
      return;
    }
    const day = getCurrentDayNumber();
    await sendDailyForm(APPROVER_EMAIL, day, TOTAL_DAYS);
    logger.info(`📧 Form email sent for Day ${day}`);
  }, { timezone: TIMEZONE });
}