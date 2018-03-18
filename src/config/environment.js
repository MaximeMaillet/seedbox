if(process.env.NODE_ENV === 'development') {
  module.exports = require('./parameters.dev.json');
} else if(process.env.NODE_ENV === 'production') {
  module.exports = require('./parameters.prod.json');
}