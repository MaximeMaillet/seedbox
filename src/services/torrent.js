const {
  torrents: torrentModel,
  files: fileModel
} = require('../models');
const Op = require('sequelize').Op;
const logger = require('../lib/logger');

/**
 * @param torrent
 * @param user
 * @return {Promise.<void>}
 */
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

/**
 * @param torrent
 * @return {Promise.<*>}
 */
async function updateTorrent(torrent) {
  return (await torrentModel.update(
    {
      downloaded: torrent.downloaded,
      uploaded: torrent.uploaded,
    },
    {where: {hash: torrent.hash}}
  ));
}

/**
 * @param torrents
 * @return {Promise.<void>}
 */
async function createBulkTorrent(torrents) {
  try {
    const hashs = torrents.map((tor) => tor.hash);
    const _torrents = torrents.map((torrent) => {
      return {
        hash: torrent.hash,
        ratio: torrent.ratio,
        path: torrent.path,
        userId: 1,
        total: torrent.length,
        name: torrent.name,
        downloaded: torrent.downloaded,
        uploaded: torrent.uploaded,
        server: torrent.server,
      };
    });

    if(_torrents.length > 0) {
      await torrentModel.bulkCreate(_torrents);

      const newTorrents = await torrentModel.findAll({where: {
        hash: {
          [Op.in]: hashs
        }
      }});

      for(const i in newTorrents) {
        await createFiles(newTorrents[i].dataValues, (torrents.filter((tor) => tor.hash === newTorrents[i].hash))[0].files);
      }
    }

  } catch(e) {
    logger.write({
      message: 'Fail to create bulk torrent',
      error: e,
    });
  }
}

/**
 * @param torrent
 * @param files
 * @return {Promise.<*>}
 */
async function createFiles(torrent, files) {
  const _files = [];
  for(const i in files) {
    _files.push({
      torrentId: torrent.id,
      name: files[i].name,
      length: files[i].length,
      path: files[i].path,
    });
  }

  if(_files.length > 0) {
    return fileModel.bulkCreate(_files);
  }

  return true;
}

/**
 * @return {Promise.<void>}
 * @param _torrents
 */
async function updateBulkTorrent(_torrents) {
  try {
    const torrents = _torrents.reverse();
    const alreadyUpdate = [];
    for(const i in torrents) {
      if(alreadyUpdate.indexOf(torrents[i].hash) === -1) {
        await torrentModel.update({
          downloaded: torrents[i].downloaded,
          uploaded: torrents[i].uploaded,
        }, {where: {hash: torrents[i].hash}});
        alreadyUpdate.push(torrents[i].hash);
      }
    }
  } catch(e) {
    logger.write({
      message: 'Fail update bulk torrent',
      error: e
    }, logger.LEVEL.ERROR);
  }
}

module.exports = {
  createTorrent,
  updateTorrent,
  updateBulkTorrent,
  createBulkTorrent,
};