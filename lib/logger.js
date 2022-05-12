require('dotenv').config();
const log4js = require('log4js');
const path = require('path');

const LOG_DIR = process.env.LOG_DIR || './_LOG';
const COMPRESS = process.env.PRODUCTION || false;
const APP_NAME = process.env.APP_NAME;

const options = {
  appenders: {
    console: { type: 'console' },
    cron: {
      type: 'fileSync',
      filename: path.join(LOG_DIR, APP_NAME ? `${APP_NAME}_cron.log` : 'cron.log'),
      maxLogSize: 512 * 1024 * 1, // 500KiB
      backups: 2,
      keepFileExt: true,
      compress: COMPRESS,
    },
    file: {
      type: 'dateFile',
      filename: path.join(LOG_DIR, APP_NAME ? `${APP_NAME}_app.log` : 'app.log'),
      pattern: 'yyyy-MM-dd',
      maxLogSize: 1024 * 1024 * 1, // 1M
      keepFileExt: true,
      compress: COMPRESS,
      alwaysIncludePattern: true,
      numBackups: 3,
    },
  },

  categories: {
    console: { appenders: ['console'], level: 'info' },
    default: { appenders: ['console', 'file'], level: 'info' },
    debug: { appenders: ['console', 'file'], level: 'debug' },
    cron: { appenders: ['cron', 'console'], level: 'info' },
  },
};

log4js.configure(options);

module.exports = (type = 'default') => log4js.getLogger(type);
