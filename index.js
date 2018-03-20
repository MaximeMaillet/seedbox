require('dotenv').config();
const fs = require('fs');
const express = require('express');
const router = require('express-imp-router');
const dtorrent = require('dtorrent');
const Sequelize = require('sequelize');
const environment = require('./src/config/environment');
const logger = require('./src/lib/logger');

checkConnection()
  .then((success) => {
    main();
  })
  .catch((err) => {
    logger.write(err, logger.LEVEL.ERROR);
    process.exit(1);
  });

async function main() {
  const torrentListener = require('./src/listeners/torrents');
  const ws = require('./src/websocket/index');

  try {
    const dConfig = [];
    for(const i in environment.dtorrent.servers) {
      dConfig.push({
        name: environment.dtorrent.servers[i].name,
        root_path: process.env.STORAGE,
        rtorrent_host: environment.dtorrent.servers[i].rtorrent_host,
        rtorrent_port: environment.dtorrent.servers[i].rtorrent_port,
        interval_check: environment.dtorrent.servers[i].interval_check,
      });
    }

    torrentListener(dtorrent);
    ws.start(dtorrent);
    dtorrent.start(dConfig);

    const app = express();
    router(app);
    router.enableDebug();
    router.route([
      {
        routes: `${__dirname}/${environment.api.routes}`,
        controllers: `${__dirname}/${environment.api.controllers}`,
        middlewares: `${__dirname}/${environment.api.middlewares}`,
        services: [
          {
            name: 'dtorrent',
            service: dtorrent.manager(),
          },
          {
            name: 'tracker',
            service: require('./src/services/tracker')
          },
          {
            name: 'server',
            service: require('./src/services/server'),
          }
        ]
      }
    ]);

    app.listen(process.env.API_PORT || 8090);
    logger.write({
      message: `API launched at port ${process.env.API_PORT || 8090}`
    });
  } catch(e) {
    logger.write(e, logger.LEVEL.ERROR);
  }
}

/**
 * Check database connection
 * @return {Promise.<boolean>}
 */
async function checkConnection() {
  const config = require('./src/config/sequelize.json')[process.env.NODE_ENV];
  const sequelize = new Sequelize(
    `${config.dialect || 'mysql'}://${process.env.MYSQL_USER || 'root'}:${process.env.MYSQL_PASSWORD || ''}@${process.env.MYSQL_HOST || '127.0.0.1'}:${process.env.MYSQL_PORT || 3306}/${process.env.MYSQL_DATABASE || 'dtorrent'}`,
    config
  );

  const err = await sequelize.authenticate();
  if(err) {
    throw err;
  }

  return true;
}