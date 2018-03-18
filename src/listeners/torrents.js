const {torrents: torrentModel} = require('../models');
const {createTorrent, updateTorrent} = require('../services/torrent');
const logger = require('../lib/logger');

module.exports = async(dtorrent) => {

  const manager = await dtorrent.manager();

  manager.addListener(
    {
      onAdded: async(_torrent) => {
        const torrent = await torrentModel.find({where: {hash: _torrent.hash}});

        logger.write(_torrent);

        try {
          if(torrent) {
            updateTorrent(_torrent);
          } else {
            createTorrent(_torrent);
          }
        } catch(e) {
          logger.write(`Failed listener : ${e.message}`, logger.LEVEL.ERROR);
        }
      },
      onUpdated: async(_torrent, diff) => {
        const torrent = await torrentModel.find({where: {hash: _torrent.hash}});
        try {
          if(torrent) {
            updateTorrent(_torrent);
          } else {
            createTorrent(_torrent);
          }
        } catch(e) {
          logger.write(`Failed listener : ${e.message}`, logger.LEVEL.ERROR);
        }
      },
      onRemoved: async(_torrent) => {
        await torrentModel.destroy({where: {hash: _torrent.hash}});
      }
    },
  );
};