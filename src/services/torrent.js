const dbModel = require('../models');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

/**
 * @param user
 * @param torrent
 * @returns {Promise<void>}
 */
module.exports.add = async(user, torrent, options) => {
  const dbTorrent = await dbModel.torrents.create(
    {
      hash: torrent.hash,
      path: torrent.path,
      user_id: user.id,
      total: torrent.length,
      name: torrent.name,
      downloaded: torrent.downloaded,
      uploaded: torrent.uploaded,
      server: torrent.server,
      active: torrent.active,
    },
    options
  );

  if(torrent.files) {
    for(let i=0; i<torrent.files.length; i++) {
      await dbModel.files.create(
        {
          name: torrent.files[i].name,
          torrent_id: dbTorrent.id,
          path: torrent.files[i].path,
          length: torrent.files[i].length,
        },
        options
      );
    }
  }

  return torrent;
};

/**
 * @param user
 * @param originalTorrent
 * @param newTorrent
 * @returns {Promise<void>}
 */
module.exports.update = async(user, originalTorrent, newTorrent) => {
  await dbModel.sequelize.transaction(async (t) => {
    if(!originalTorrent) {
      throw new Error('Torrent does not exists');
    }

    originalTorrent.downloaded = newTorrent.downloaded;
    originalTorrent.uploaded = newTorrent.uploaded;
    originalTorrent.active = newTorrent.active;
    await originalTorrent.save({transaction: t});

    if(newTorrent.files) {
      for(let i=0; i<newTorrent.files.length; i++) {
        const file = await dbModel.files.findOne({where: {path: newTorrent.files[i].path}}, {transaction: t});
        if(file) {
          continue;
        }
        await dbModel.files.create(
          {
            name: newTorrent.files[i].name,
            torrent_id: originalTorrent.id,
            path: newTorrent.files[i].path,
            length: newTorrent.files[i].length,
          },
          {transaction: t}
        );
      }
    }

    return originalTorrent;
  });
};

/**
 * @param user
 * @param data
 * @param options
 * @returns {Promise<void>}
 */
module.exports.create = async(user, data, options) => {
  await dbModel.torrents.create(
    data,
    options,
  );
};

module.exports.sendFileToServer = async(server, file) => {
  const formData = new FormData();
  formData.append('torrents', fs.createReadStream(file.path), {filename: file.originalname, contentType: file.mimetype,});
  const http = server.secure ? 'https://' : 'http://';
  await axios.post(
    `${http}${server.host}:${server.port}/ws/upload`,
    formData,
    { headers: formData.getHeaders() }
  );
};

// /**
//  * @param torrent
//  * @param user
//  * @return {Promise.<void>}
//  */
// async function createTorrent(torrent, user) {
//   const _torrent = await torrentModel.create({
//     hash: torrent.hash,
//     path: torrent.path,
//     userId: user ? user.id : 1,
//     total: torrent.length,
//     name: torrent.name,
//     downloaded: torrent.downloaded,
//     uploaded: torrent.uploaded,
//     server: torrent.server,
//     active: torrent.active,
//   });
//
//   for(const i in torrent.files) {
//     await fileModel.create({
//       length: torrent.files[i].length,
//       name: torrent.files[i].name,
//       path: torrent.files[i].path,
//       torrentId: _torrent.id,
//     });
//   }
// }
//
// /**
//  * @param torrent
//  * @return {Promise.<*>}
//  */
// async function updateTorrent(torrent) {
//   return (await torrentModel.update(
//     {
//       downloaded: torrent.downloaded,
//       uploaded: torrent.uploaded,
//       active: torrent.active,
//     },
//     {where: {hash: torrent.hash}}
//   ));
// }
//
// /**
//  * @param torrents
//  * @return {Promise.<void>}
//  */
// async function createBulkTorrent(torrents) {
//   try {
//     const hashs = torrents.map((tor) => tor.hash);
//     const _torrents = torrents.map((torrent) => {
//       return {
//         hash: torrent.hash,
//         ratio: torrent.ratio,
//         path: torrent.path,
//         userId: 1,
//         total: torrent.length,
//         name: torrent.name,
//         downloaded: torrent.downloaded,
//         uploaded: torrent.uploaded,
//         server: torrent.server,
//         active: torrent.active,
//       };
//     });
//
//     if(_torrents.length > 0) {
//       await torrentModel.bulkCreate(_torrents);
//
//       const newTorrents = await torrentModel.findAll({where: {
//         hash: {
//           [Op.in]: hashs
//         }
//       }});
//
//       for(const i in newTorrents) {
//         await createFiles(newTorrents[i].dataValues, (torrents.filter((tor) => tor.hash === newTorrents[i].hash))[0].files);
//       }
//     }
//
//   } catch(e) {
//     logger.write({
//       message: 'Fail to create bulk torrent',
//       error: e,
//     });
//   }
// }
//
// /**
//  * @param torrent
//  * @param files
//  * @return {Promise.<*>}
//  */
// async function createFiles(torrent, files) {
//   const _files = [];
//   for(const i in files) {
//     _files.push({
//       torrentId: torrent.id,
//       name: files[i].name,
//       length: files[i].length,
//       path: files[i].path,
//     });
//   }
//
//   if(_files.length > 0) {
//     return fileModel.bulkCreate(_files);
//   }
//
//   return true;
// }
//
// /**
//  * @return {Promise.<void>}
//  * @param _torrents
//  */
// async function updateBulkTorrent(_torrents) {
//   try {
//     const torrents = _torrents.reverse();
//     const alreadyUpdate = [];
//     for(const i in torrents) {
//       if(alreadyUpdate.indexOf(torrents[i].hash) === -1) {
//         await torrentModel.update({
//           downloaded: torrents[i].downloaded,
//           uploaded: torrents[i].uploaded,
//           active: torrents[i].active,
//         }, {where: {hash: torrents[i].hash}});
//         alreadyUpdate.push(torrents[i].hash);
//       }
//     }
//   } catch(e) {
//     logger.write({
//       message: 'Fail update bulk torrent',
//       error: e
//     }, logger.LEVEL.ERROR);
//   }
// }

// module.exports = {
//   createTorrent,
//   updateTorrent,
//   updateBulkTorrent,
//   createBulkTorrent,
// };