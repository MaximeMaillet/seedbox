const path = require('path');
const fs = require('fs');
const moment = require('moment');
const logConfig = require('../config').logger;

function write(message, level) {
  if(!level) {
    level = LEVEL.DEBUG;
  }

  const date = moment();
  const levelString = level === LEVEL.ERROR ? 'ERROR' : level === LEVEL.WARN ? 'WARN' : 'DEBUG';
  const completeMessage = `[${levelString}][${date.toISOString()}] : ${message}`;

  if(logConfig.mode === 'console') {
    console.log(completeMessage);
  } else if(logConfig.mode === 'files') {
    const logFile = `${path.resolve('.')}/${logConfig.directory}/${date.format('YYYYMMDD')}_${levelString.toLowerCase()}.log`;

    if(!fs.existsSync(logFile)) {
      fs.writeFile(
        logFile,
        `${completeMessage}\n`,
        'utf8',
        (err) => {
          if(err) {
            console.log('Logger errors');
            console.log(err);
          }
        }
      );
    } else {
      fs.appendFile(
        logFile,
        `${completeMessage}\n`,
        'utf8',
        (err) => {
          if(err) {
            console.log('Logger errors');
            console.log(err);
          }
        }
      );
    }
  }
}

const LEVEL = {
  DEBUG: 1,
  WARN: 2,
  ERROR: 3,
};

module.exports = {
  LEVEL,
  write,
};