const {
  torrents: torrentModel,
  files: fileModel
} = require('../models');

async function createTorrent(torrent, user) {
  const _torrent = await torrentModel.create({
    hash: torrent.hash,
    ratio: torrent.ratio,
    path: torrent.path,
    userId: user ? user.id : 1,
    total: torrent.total,
    name: torrent.name,
    downloaded: torrent.downloaded,
    uploaded: torrent.uploaded,
  });

  for(const i in torrent.files) {
    await fileModel.create({
      pid: torrent.pid,
      name: torrent.files[i].name,
      path: torrent.files[i].path,
      torrentId: _torrent.id,
    });
  }
}

async function updateTorrent(torrent) {
  return (await torrentModel.update(
    {
      downloaded: torrent.downloaded,
      uploaded: torrent.uploaded,
    },
    {where: {hash: torrent.hash}}
  ));
}

module.exports = {
  createTorrent,
  updateTorrent,
};