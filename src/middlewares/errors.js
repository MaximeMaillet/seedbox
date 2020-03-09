module.exports = {
  apply,
};

function apply(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    return res.status(401).send({
      message: 'Unauthorized'
    })
  }

  res.status(500).send({
    message: err.message,
  });
}
