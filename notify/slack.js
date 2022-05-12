require('dotenv').config();
const SlackNotify = require('slack-notify');
const Notify = require('./notify');

class Slack extends Notify {
  constructor() {
    super('slack');
    this.client = SlackNotify(process.env.SLACK_WEBHOOK_URL);
  }

  async report(message, { logType, slackType }) {
    this.logger[logType](message);
    if (!this.silent) {
      try {
        await this.client[slackType](message);
      } catch (e) {
        this.logger.error(`error sending message on slack`);
      }
    }
  }

  async info(message) {
    await this.report(message, { logType: 'info', slackType: 'send' })
  }

  async alert(message) {
    await this.report(message, { logType: 'warn', slackType: 'alert' })
  }
}

module.exports = Slack;
