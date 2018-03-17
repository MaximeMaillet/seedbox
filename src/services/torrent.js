const {
  torrents: torrentModel,
  files: fileModel
} = require('../models');

async function createTorrent(torrent, user) {
  const _torrent = await torrentModel.create({
    hash: torrent.hash,
    ratio: torrent.ratio,
    path: torrent.path,
    userId: user.id,
    total: torrent.total,
    name: torrent.name,
    downloaded: torrent.downloaded,
    uploaded: torrent.uploaded,
  });

  for(const i in torrent.files) {
    await fileModel.create({
      name: torrent.files[i].name,
      path: torrent.files[i].path,
      torrentId: _torrent.id,
    });
  }
}

module.exports = {
  createTorrent,
};