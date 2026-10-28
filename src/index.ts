import app from './server';
import { startDailyJob } from './jobs/dailyPostJob';
import { PORT } from './config/env';
import { logger } from './utils/logger';

startDailyJob();
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});