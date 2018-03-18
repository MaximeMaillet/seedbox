const parameters = require('../config/environment');

function getServer() {
  return parameters.dtorrent.servers[0].name;
}

function getServerConfigFromPid(pid) {
  return parameters.dtorrent.servers[pid];
}

module.exports = {
  getServer,
  getServerConfigFromPid,
};