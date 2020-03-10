const config = require('../config');
const serverTransformer = require('../transformers/server');

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.getAll = async(req, res, next) => {
  try {
    res
      .status(200)
      .send(serverTransformer.transform(config.torrent.servers, req.user))
    ;
  } catch(e) {
    next(e);
  }
};