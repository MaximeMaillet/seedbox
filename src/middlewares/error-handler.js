require('dotenv').config();

module.exports.handle = async(err, req, res, next) => {

  let statusCode = err.statusCode || 400,
    body = {message: err.message},
    type = 'json';

  if(err.name === 'HtmlError') {
    type = 'html';
    body = err.body;
  } else if(err.name === 'ApiError') {
    type = 'json';
    body = {
      message: err.message,
      fields: err.fields,
    };

    if(process.env.NODE_ENV === 'development') {
      body.error = err.stack;
      body.previous = err.previous ? err.previous.stack : null;
    }
  }

  res
    .status(statusCode)
    .type(type)
    .send(body)
  ;
};