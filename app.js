const { ff } = require('fssf');
const scanner = require('./scanner');
const STATE_FILE = ff.path(__dirname, 'backup.json');

let currentState = {};
let initialized = false;

async function init() {
  try {
    currentState = await ff.readJson(STATE_FILE);
    initialized = true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      await ff.writeJson({}, STATE_FILE);
      initialized = true;
    }
  }
}

module.exports = async function () {
  if (!initialized) await init();
  const newState = await scanner.execute(currentState);
  if (newState) {
    currentState = newState;
    await ff.writeJson(newState, STATE_FILE);
  }
}
