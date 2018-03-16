const {torrents: torrentModel, users: userModel} = require('../models');
const torrentTransformer = require('../transformers/torrent');
const userService = require('../services/user');

module.exports = {
  getTorrent,
  getTorrents,
  postTorrent,
  downloadTorrent,
};

/**
 * @param req
 * @param res
 * @return {Promise.<ServerResponse>}
 */
async function getTorrents(req, res) {
  try {
    const whereClause = {};
    if(!userService.isGranted(req.session.user, 'admin')) {
      whereClause.where = {is_removed: false};
    }
    const torrents = await torrentModel.findAll();
    return res.send(torrentTransformer.transform(torrents, req.session.user));
  } catch(e) {
    res.status(500).send(e);
  }
}

/**
 * @param req
 * @param res
 * @return {Promise.<ServerResponse>}
 */
async function getTorrent(req, res) {
  try {
    const {id} = req.params;
    const torrent = await torrentModel.find({where: {id}});
    if(!torrent) {
      return res.status(404).send({message: 'Torrent not found'});
    }
    return res.send(torrentTransformer.transform(torrent, req.session.user));
  } catch(e) {
    res.status(500).send(e);
  }
}

/**
 *
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function postTorrent(req, res) {
  try {
    const {files, torrents} = req.files;
    const {dtorrent, tracker} = req.services;
    const promises = [];
    let spaceToRemoveForUser = 0;

    if(files && torrents) {
      if(files.length === 1 && torrents.length === 1) {
        promises.push(dtorrent.createFromTorrentAndData(torrents[0].path, files[0].path));
      }
      else {
        return res.status(422).send();
      }
    }

    if(!files && torrents && torrents.length > 0) {
      let torrent = null;
      for(const i in torrents) {
        torrent = dtorrent.extractTorrentFile(torrents[i].path);
        if(tracker.isInWhiteList(torrent.announce) && !tracker.isInBlackList(torrent.announce)) {
          if(req.session.user.space > torrent.info.total_size) {
            spaceToRemoveForUser += torrent.info.total_size;
            promises.push(dtorrent.createFromTorrent(torrents[i].path));
          }
        }
      }

      if(promises.length === 0) {
        return res.status(422).send({
          message: 'Your torrents have no trackers authorized',
          errors: torrent.announce,
        });
      }
    }
    else {
      return res.status(404).send();
    }

    const finalTorrents = await Promise.all(promises);
    const dataReturn = [];
    for (const i in finalTorrents) {
      dataReturn.push(finalTorrents[i].torrent);

      if (finalTorrents[i].success) {
        await torrentModel.create({
          hash: finalTorrents[i].torrent.hash,
          ratio: finalTorrents[i].torrent.ratio,
          path: finalTorrents[i].torrent.path,
          userId: req.session.user.id,
          name: finalTorrents[i].torrent.name,
          downloaded: finalTorrents[i].torrent.downloaded,
          uploaded: finalTorrents[i].torrent.uploaded,
        });
      }
    }

    req.session.user.space -= spaceToRemoveForUser;
    await userModel.update(
      {space: spaceToRemoveForUser},
      {where: {id: req.session.user.id}}
    );

    return res.send(torrentTransformer.transform(dataReturn, req.session.user));
  } catch(e) {
    res.status(500).send(e);
  }
}

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function downloadTorrent(req, res) {
  try {
    const { id } = req.params;

    const torrent = await torrentModel.find({where: {id}});

    if(!torrent) {
      return res.status(404).send();
    }

    const options = {
      // root: __dirname,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    const fs = require('fs');
    console.log(torrent.dataValues.path);

    return res.sendFile(__dirname+'/'+torrent.dataValues.path, options, (err) => {
      if(err) {
        res.status(404).send(err);
      } else {
        console.log('Sent');
      }
    });
  } catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
}