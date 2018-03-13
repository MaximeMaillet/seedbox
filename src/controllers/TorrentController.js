const {torrents: torrentModel} = require('../models');
const torrentTransformer = require('../transformers/torrent');

module.exports = {
  getTorrent,
  getTorrents,
  postTorrent
};

/**
 * @param req
 * @param res
 * @return {Promise.<ServerResponse>}
 */
async function getTorrents(req, res) {
  try {
    const torrents = await torrentModel.findAll();
    return res.send(torrentTransformer.transform(torrents, req.session.user));
  } catch(e) {
    console.log(e);
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

    if(files && files.length === 1 && torrents && torrents.length === 1) {
      promises.push(dtorrent.createFromTorrentAndData(torrents[0].path, files[0].path));
    }
    else if(!files && torrents && torrents.length > 0) {
      let torrent = null;
      for(const i in torrents) {
        torrent = dtorrent.extractTorrentFile(torrents[i].path);
        if(tracker.isInWhiteList(torrent.announce) && !tracker.isInBlackList(torrent.announce)) {
          if(req.session.user.space > torrent.info.total_size) {
            req.session.user.space -= torrent.info.total_size;
            promises.push(dtorrent.createFromTorrent(torrents[i].path));
          }
        }
      }

      if(promises.length === 0) {
        return res.status(422).send({
          message: 'Your torrents are blacklisted'
        });
      }
    }
    else {
      return res.status(404).send();
    }

    return Promise.all(promises)
      .then(async(torrents) => {
        for (const i in torrents) {
          torrents[i].torrent = Object.assign(
            torrentTransformer.transform(torrents[i].torrent, req.session.user),
            torrents[i].torrent
          );

          if (torrents[i].success) {
            try {
              await torrentModel.create({
                hash: torrents[i].torrent.hash,
                ratio: torrents[i].torrent.ratio,
                userId: req.session.user.id,
                name: torrents[i].torrent.name,
                downloaded: torrents[i].torrent.downloaded,
                uploaded: torrents[i].torrent.uploaded,
              });
            } catch(e) {
             // @todo sentry or what ever or loose promise in the universe
            }
          }
        }

        return torrents;
      })
     .then((torrents) => {
       return res.send(torrentTransformer.transform(torrents, req.session.user));
     })
    ;
  } catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
}