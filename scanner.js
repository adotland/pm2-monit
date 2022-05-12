const util = require('util');
const exec = util.promisify(require('child_process').exec);
const logger = require('./lib/logger')();
const pm2LineRegex = require('./lib/pm2Regex');
const Notify = require('./notify/slack');
const notify = new Notify();

async function processData(raw, prevData) {
  const parsed = Array.from(raw.matchAll(pm2LineRegex));
  const currData = {};
  const currProcList = [];
  const prevProcList = [];
  let diffDetected = false;
  parsed.forEach(row => {
    const name = row[2];
    currProcList.push(name);
    currData[name] = {
      id: row[1],
      status: row[9]
    }
  });
  if (prevData) {
    for (const name in prevData) {
      prevProcList.push(name);
      const prevProcess = prevData[name];
      const currProcess = currData[name];
      if (currProcess) {
        if (currProcess.status != prevProcess.status) {
          const message = `change detected [${name}] changed status from [${prevProcess.status}] to [${currProcess.status}]`;
          await notify.alert(message);
          diffDetected = true;
        }
      } else {
        const message = `missing process detected [${name}]`
        await notify.alert(message);
        diffDetected = true;
      }
    }
  }

  const newProcList = currProcList.filter(p => !prevProcList.includes(p));

  await Promise.all(newProcList.map(async name => {
    const message = `new process detected [${name}]`
    await notify.info(message);
    diffDetected = true;
  }));

  if (diffDetected) return currData;
}

async function execute(prevState) {
  logger.debug('running scanner');
  const command = 'pm2 list';
  try {
    const { stdout } = await exec(command);
    return await processData(stdout, prevState);
  } catch (e) {
    logger.error(e);
  }
}

module.exports = { execute };
