const {torrents: torrentModel} = require('../models');
const {createTorrent, updateTorrent, updateBulkTorrent, createBulkTorrent} = require('../services/torrent');
const logger = require('../lib/logger');
const Op = require('sequelize').Op;

module.exports = async(dtorrent) => {

  const manager = await dtorrent.manager();
  const waitingTorrents = [];
  const updatingTorrents = [];
  const checks = {
    insert: 0,
    update: 0,
  };

  manager.addListener(
    {
      onAdded: async(_torrent) => {
        waitingTorrents.push({
          action: 'insert',
          torrent: _torrent,
        });
      },
      onUpdated: async(_torrent) => {
        updatingTorrents.push(_torrent);
      },
      onRemoved: async(_torrent) => {
        await torrentModel.destroy({where: {hash: _torrent.hash}});
      }
    },
  );

  setInterval(
    async() => {
      if(waitingTorrents.length > 0 && (checks.insert >= 5 || waitingTorrents.length > 10)) {
        checks.insert = 0;
        const hashs = waitingTorrents.map((obj) => obj.torrent.hash);
        const torrents = await torrentModel.findAll({where: {
          hash: {
            [Op.in]: hashs
          }
        }});

        const existsTorrents = torrents.map((obj) => obj.hash);
        const toCreate = [];

        for(const i in waitingTorrents) {
          if(existsTorrents.indexOf(waitingTorrents[i].torrent.hash) === -1) {
            toCreate.push(waitingTorrents[i].torrent);
          }
        }

        createBulkTorrent(toCreate);
        waitingTorrents.slice(0, waitingTorrents.length-1);
      } else {
        checks.insert++;
      }

      if(updatingTorrents.length > 0 && (checks.update >= 5 || updatingTorrents.length > 10)) {
        checks.update = 0;

        updateBulkTorrent(updatingTorrents);
      } else {
        checks.update++;
      }
    },
    5000
  );
};