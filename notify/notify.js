require('dotenv').config();
const Logger = require('../lib/logger');
const SILENT = process.env.SILENT || false;

class Notify {
  constructor(type) {
    this.logger = Logger(type);
    this.silent = SILENT;
  }
}

module.exports = Notify;
