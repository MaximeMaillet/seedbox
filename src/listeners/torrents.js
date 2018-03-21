const {torrents: torrentModel} = require('../models');
const {updateTorrent, createTorrent} = require('../services/torrent');
const logger = require('../lib/logger');
const Op = require('sequelize').Op;

module.exports = async(dtorrent) => {

  const manager = await dtorrent.manager();

  manager.addListener(
    {
      onAdded: async(_torrent) => {
        try {
          const torrent = await torrentModel.find({where: {
            hash: {[Op.eq]: _torrent.hash}
          }});

          if(torrent) {
            updateTorrent(Object.assign(_torrent, {
              id: torrent.dataValues.id,
            }));
          } else {
            createTorrent(_torrent);
          }
        } catch(e) {
          logger.write({
            message: 'Fail onAdded',
            error: e
          }, logger.LEVEL.ERROR);
        }
      },
      onUpdated: async(_torrent) => {
        try {
          const torrent = await torrentModel.find({where: {
            hash: {[Op.eq]: _torrent.hash}
          }});

          if(torrent) {
            updateTorrent(Object.assign(_torrent, {
              id: torrent.dataValues.id,
            }));
          } else {
            createTorrent(_torrent);
          }
        } catch(e) {
          logger.write({
            message: 'Fail onAdded',
            error: e
          }, logger.LEVEL.ERROR);
        }
      },
      onRemoved: async(_torrent) => {
        await torrentModel.destroy({where: {hash: _torrent.hash}});
      }
    },
  );
};