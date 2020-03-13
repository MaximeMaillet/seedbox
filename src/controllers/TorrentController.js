const torrentTransformer = require('../transformers/torrent');
const userService = require('../services/user');
const request = require('request');
const {USER_ROLES} = require('../class/Roles');
const ApiError = require('../class/ApiError');
const dbModel = require('../models');
const serverService = require('../services/server');
const torrentService = require('../services/torrent');
const dTorrent = require('dtorrent');

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports.getAll = async(req, res, next) => {
  try {
    const torrents = await dbModel.torrents.findAll({
      include: [
        {model: dbModel.users},
        {model: dbModel.files},
      ]
    });
    return res.send(torrentTransformer.transform(torrents, req.user));
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports.getOneWithId = async(req, res, next) => {
  try {
    const torrent = await dbModel.torrents.findOne({
      where: {id: req.params.torrentId},
      include: [
        {model: dbModel.users},
        {model: dbModel.files},
      ],
    });

    if(!torrent) {
      throw new ApiError(404, 'This torrent does not exists');
    }

    res
      .status(200)
      .send(torrentTransformer.transform(torrent, req.user))
    ;
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports.getOneWithHash = async(req, res, next) => {
  try {
    const torrent = await dbModel.torrents.findOne({
      where: {hash: req.params.hash},
      include: [
        {model: dbModel.users},
        {model: dbModel.files},
      ],
    });

    if(!torrent) {
      throw new ApiError(404, 'This torrent does not exists');
    }

    res
      .status(200)
      .send(torrentTransformer.transform(torrent, req.user))
    ;
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.create = async(req, res, next) => {
  try {
    const {torrents} = req.files;
    const {server} = req.body;

    const _server = serverService.get(server);
    if(!_server) {
      throw new ApiError(404, 'This server does not exists');
    }

    const files = await torrentService.handle(req.user, _server, torrents);
    const errorFiles = files.filter((f) => !f.send);

    if(errorFiles.length > 0) {
      throw new ApiError(422, 'Upload failed', {torrents: errorFiles.map((e) => e.message).join(',')}, new Error(JSON.stringify(files)));
    }

    res
      .status(200)
      .send({success: true});
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports.getFile = async(req, res, next) => {
  try {
    const {torrentId, hash} = req.params;

    const torrent = await dbModel.torrents.findOne({
      where: torrentId ? {id: torrentId} : {hash}
    });

    if(!torrent) {
      throw new ApiError(404, 'This torrent does not exists');
    }

    const server = serverService.get(torrent.server);

    const file = await dbModel.files.findOne({
      where: {
        id: req.params.fileId,
        torrent_id: torrent.id,
      }
    });

    if(!file) {
      throw new ApiError(404, 'This file does not exists');
    }

    return request({
      method:'GET',
      url: `${server.secure ? 'https':'http'}://${server.host}:${server.port}/downloaded/${file.path}`,
    }).pipe(res);
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.resume = async(req, res, next) => {
  try {
    const {torrentId, hash} = req.params;

    const torrent = await dbModel.torrents.findOne({
      where: torrentId ? {id: torrentId} : {hash}
    });

    if(!torrent) {
      throw new ApiError(404, 'This torrent does not exists');
    }

    const server = serverService.get(torrent.server);
    const manager = dTorrent.manager(server.name);
    const newTorrent = await manager.resume(torrent.hash);

    res.send(torrentTransformer.transform(newTorrent, req.user));
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.pause = async(req, res, next) => {
  try {
    const {torrentId, hash} = req.params;

    const torrent = await dbModel.torrents.findOne({
      where: torrentId ? {id: torrentId} : {hash}
    });

    if(!torrent) {
      throw new ApiError(404, 'This torrent does not exists');
    }

    const server = serverService.get(torrent.server);
    const manager = dTorrent.manager(server.name);
    const newTorrent = await manager.pause(torrent.hash);

    res.send(torrentTransformer.transform(newTorrent, req.user));
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.remove = async(req, res, next) => {
  try {
    const {torrentId, hash} = req.params;

    const torrent = await dbModel.torrents.findOne({
      where: torrentId ? {id: parseInt(torrentId)} : {hash}
    });

    if(!torrent) {
      throw new ApiError(404, 'This torrent does not exists');
    }

    const server = serverService.get(torrent.server);
    const manager = dTorrent.manager(server.name);
    await manager.remove(torrent.hash);

    res.send({
      message: 'success'
    });
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.getForUser = async(req, res, next) => {
  try {
    const torrents = await dbModel.torrents.findAll({
      where: {user_id: req.params.userId},
      include: [
        {model: dbModel.users},
        {model: dbModel.files},
      ],
    });

    if(!torrents) {
      throw new ApiError(404, 'This torrent does not exists');
    }

    res
      .status(200)
      .send(torrentTransformer.transform(torrents, req.user))
    ;
  } catch(e) {
    next(e);
  }
};