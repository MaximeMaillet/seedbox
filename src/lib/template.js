const path = require('path');
const fs = require('fs');
const twig = require('twig');

const appDir = path.dirname(require.main.filename);
const viewsDirectory = `${appDir}/src/resources/views/`;

function twigToHtml(views, data) {
  return new Promise((resolve, reject) => {
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