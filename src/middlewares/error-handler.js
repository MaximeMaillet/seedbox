require('dotenv').config();

module.exports.handle = async(err, req, res, next) => {
  if(process.env.NODE_ENV === 'production') {
    if(err.name === 'HtmlError') {
      res
        .status(err.statusCode || 400)
        .type('html')
        .send(err.body)
      ;
    } else {
      res
        .status(err.statusCode || 400)
        .type('json')
        .send({
          message: err.message,
        })
      ;
    }
  } else {
    if(err.name === 'HtmlError') {
      res
        .status(err.statusCode || 400)
        .type('html')
        .send(err.body)
      ;
    } else {
      res
        .status(err.statusCode || 400)
        .type('json')
        .send({
          message: err.message,
          error: err.stack,
          previous: err.previous ? err.previous.stack : null,
        })
      ;
    }
  }
};