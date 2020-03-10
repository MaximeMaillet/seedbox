const config = require('../config');

module.exports.get = (name) => {
  return config.torrent.servers.filter((server) => server.name === name)[0];
};