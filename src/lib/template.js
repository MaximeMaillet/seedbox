const path = require('path');
const fs = require('fs');
const twig = require('twig');

function twigToHtml(views, data) {
  return new Promise((resolve, reject) => {
    const viewsDirectory = `${path.resolve('.')}/src/resources/views/`;
    if(fs.existsSync(viewsDirectory+views)) {
      return twig.renderFile(viewsDirectory+views, data, (err, html) => {
        if(err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    } else {
      reject('Not exists');
    }
  });
}

module.exports = {
  twigToHtml,
};