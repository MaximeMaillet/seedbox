const {torrents: torrentModel} = require('../models');
const {createTorrent, updateTorrent} = require('../services/torrent');

module.exports = async(dtorrent) => {

  const manager = await dtorrent.manager();

  manager.addListener(
    {
      onAdded: async(_torrent) => {
        const torrent = await torrentModel.find({where: {hash: _torrent.hash}});

        if(torrent) {
          updateTorrent(_torrent);
        } else {
          createTorrent(_torrent);
        }
      },
      onUpdated: async(_torrent, diff) => {
        const torrent = await torrentModel.find({where: {hash: _torrent.hash}});
        if(torrent) {
          updateTorrent(_torrent);
        } else {
          createTorrent(_torrent);
        }
      },
      onRemoved: async(_torrent) => {
        await torrentModel.destroy({where: {hash: _torrent.hash}});
      }
    },
  );
};