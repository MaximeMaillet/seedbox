const {torrents: torrentModel} = require('../models');

module.exports = (manager) => {

  manager.addListener({
    onAdded: async(torrent) => {

    }
  });

};