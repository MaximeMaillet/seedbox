const fs = require('fs');
const environment = require('../config/environment');

async function write(message, level) {
  let log = environment.log.debug;
  if(level === module.exports.LEVEL.ERROR) {
    log = environment.log.error;
  }

  if(environment.log.console) {
    console.log(level === module.exports.LEVEL.ERROR ? 'Error' : '');
    console.log(message);
  } else {
    if(fs.existsSync(log)) {
      fs.appendFile(
        log,
        `${(new Date())} : ${JSON.stringify(message)}\n`,
        'utf8',
        (err) => {
          if(err) {
            console.log('Logger errors');
            console.log(err);
          }
        }
      );
    } else {
      fs.writeFile(
        log,
        `${(new Date())} : ${JSON.stringify(message)}\n`,
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

module.exports = {
  LEVEL: {
    DEBUG: 1,
    ERROR: 2,
  },
  write,
};