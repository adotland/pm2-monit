require('dotenv').config();
const logger = require('./lib/logger')('cron');
const schedule = require('node-schedule');
const app = require('./app');

const EVERY_MINUTE = '0 */1 * * * *';
const FREQUENCY = process.env.CRON_REGEX || EVERY_MINUTE;

logger.info('begin');

schedule.scheduleJob(FREQUENCY, async () => { await app(); });

process
  .on('unhandledRejection', (reason, p) => {
    logger.error(reason, 'Unhandled Rejection at Promise', p);
    schedule.gracefulShutdown()
      .then(() => process.exit(1));
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    schedule.gracefulShutdown()
      .then(() => process.exit(1));
  })
  .on('SIGINT', (s) => {
    logger.warn(`shutting down gracefully [${s}]`);
    schedule.gracefulShutdown()
      .then(() => process.exit(0));
  })
  .on('warning', (e) => console.warn(e.stack))
  .on('exit', (s) => {
    logger.warn(`end [${s}]`);
  });
