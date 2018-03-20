const parameters = require('../config/environment');

function getServer() {
  return parameters.dtorrent.servers[0].name;
}

function getServerFromName(name) {
  for(const i in parameters.dtorrent.servers) {
    if(parameters.dtorrent.servers[i].name === name) {
      return parameters.dtorrent.servers[i];
    }
  }

  return null;
}

/**
 * @deprecated
 * @param pid
 */
function getServerConfigFromPid(pid) {
  return parameters.dtorrent.servers[pid-1];
}

module.exports = {
  getServer,
  getServerFromName,
  getServerConfigFromPid,
};