const torrentService = require('../services/torrent');
const logger = require('../lib/logger');
const botService = require('../services/bot');
const dTorrent = require('dtorrent');
const dbModel = require('../models');

module.exports.start = async() => {
  const manager = await dTorrent.manager();
  manager.addListener(
    {
      onAdded: async(torrent) => {
        try {
          const userBot = await botService.get();
          if(!userBot) {
            throw new Error('User bot does not exists');
          }

          const dbTorrent = await dbModel.torrents.findOne({
            where: {
              hash: {[dbModel.Sequelize.Op.eq]: torrent.hash}
            }
          });

          if(dbTorrent) {
            await torrentService.update(userBot, dbTorrent, torrent);
          } else {
            await dbModel.sequelize.transaction(async (t) => {
              await torrentService.add(userBot, torrent, {transaction: t});
            });
          }
        } catch(e) {
          logger.write(`[torrentListenerException::onAdded] ${e.message}`, logger.LEVEL.ERROR);
        }
      },
      onUpdated: async(torrent) => {
        try {
          const userBot = await botService.get();
          if(!userBot) {
            throw new Error('User bot does not exists');
          }

          const dbTorrent = await dbModel.torrents.findOne({
            where: {
              hash: {[dbModel.Sequelize.Op.eq]: torrent.hash}
            }
          });

          if(dbTorrent) {
            await torrentService.update(userBot, dbTorrent, torrent);
          }
        } catch(e) {
          logger.write(`[torrentListenerException::onUpdated] ${e.message}`, logger.LEVEL.ERROR);
        }
      },
      onRemoved: async(torrent) => {
        try {
          console.log('onRemove');
          console.log(torrent.hash);
          const dbTorrent = await dbModel.torrents.findOne({
            where: {
              hash: {[dbModel.Sequelize.Op.eq]: torrent.hash}
            }
          });

          if(dbTorrent) {
            await dbTorrent.destroy();
          }
        } catch(e) {
          logger.write(`[torrentListenerException::onRemoved] ${e.message}`, logger.LEVEL.ERROR);
        }
      }
    },
  );
};