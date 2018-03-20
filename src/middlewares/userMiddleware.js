module.exports = {
  shouldConnected,
};

function shouldConnected(req, res, next) {
  if(!req.session || !req.session.user) {
    return res.status(401).send();
  }

  next();
}