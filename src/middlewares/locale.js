module.exports.extract = async(req, res, next) => {
  try {
    const translation = require('../translations');
    const defaultLanguage = 'en_US';
    if(req.headers && req.headers['accept-language']) {
      if(translation.availableLanguage().indexOf(req.headers['accept-language']) !== -1) {
        req.translation = new translation(req.headers['accept-language']);
      } else {
        req.translation = new translation(defaultLanguage);
      }
    } else {
      req.translation = new translation(defaultLanguage);
    }

    next();
  } catch(e) {
    next(e);
  }
};