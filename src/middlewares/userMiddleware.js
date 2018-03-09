module.exports = {
  connected,
};

function connected(req, res, next) {
  if(!req.session || !req.session.user) {
    return res.status(401).send();
  }

  next();
}