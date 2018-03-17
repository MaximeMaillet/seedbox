const parameters = require('../config/parameters.json');

function getServer() {
  return parameters.servers.local;
}

module.exports = {
  getServer,
};