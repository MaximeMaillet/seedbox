require('dotenv').config();
const fs = require('fs');
const express = require('express');
const router = require('express-imp-router');
const bodyParser = require('body-parser');
const cors = require('cors');
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
    // const dConfig = [];
    // for(const i in environment.dtorrent.servers) {
    //   dConfig.push({
    //     name: environment.dtorrent.servers[i].name,
    //     root_path: process.env.STORAGE,
    //     rtorrent_host: environment.dtorrent.servers[i].rtorrent_host,
    //     rtorrent_port: environment.dtorrent.servers[i].rtorrent_port,
    //     interval_check: environment.dtorrent.servers[i].interval_check,
    //   });
    // }
    //
    // torrentListener(dtorrent);
    // ws.start(dtorrent);
    // dtorrent.start(dConfig);

    const app = express();
    router(app);
    router.enableDebug();

    const whitelist = process.env.CORS_DOMAIN.split(',');
    app.use(cors({
      origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      allowedHeaders: ['Authorization', 'Content-Type', 'Origin', 'Referer', 'User-Agent', '*']
    }));

    router.route([
      {
        controllers: `${__dirname}/${environment.api.controllers}`,
        middlewares: `${__dirname}/${environment.api.middlewares}`,
        routes: {
          "/api": {
            // "_middlewares_": [
            //   {
            //     "target": "*",
            //     "action": [
            //       "apiMiddleware#cors",
            //       "apiMiddleware#bodyParserJson",
            //       "apiMiddleware#bodyParserUrlencoded",
            //       "apiMiddleware#jwt",
            //       "apiMiddleware#rewriteSession"
            //     ]
            //   },
            //   {
            //     "target": ["/api/torrents"],
            //     "type": "inject",
            //     "action": ["apiMiddleware#multer"]
            //   }
            // ],
            "/authenticate": {
              "/confirm": {
                "get": "AuthenticateController#confirm"
              },
              "/logout": {
                "get": "AuthenticateController#logout"
              },
              "/login": {
                "_middleware_": {
                  controllers:[bodyParser.json(), 'api#cors']
                },
                "post": "AuthenticateController#login"
              },
              "/subscribe": {
                "_middleware_": {
                  controllers:[bodyParser.json()]
                },
                "post": "AuthenticateController#subscribe"
              },
              "/forgot": {
                "post": "AuthenticateController#forgot"
              },
              "/password": {
                "post": "AuthenticateController#passwordPost",
                "/:token": {
                  "get": "AuthenticateController#passwordGet"
                }
              }
            },
            "/users": {
              "get": "UserController#getUsers",
              "/:id": {
                "get": "UserController#getUser",
                "patch": "UserController#patchUser",
                "delete": "UserController#deleteUser"
              }
            },
            "/torrents": {
              "_middlewares": ["userMiddleware#shouldConnected"],
              "_services": ["dtorrent", "tracker", "server"],
              "get": "TorrentController#getTorrents",
              "post": "TorrentController#postTorrent",
              "/:id": {
                "get": "TorrentController#getTorrent",
                "delete": "TorrentController#remove",
                "/download/:fileId/:name": {
                  "get": "TorrentController#downloadFile"
                },
                "/pause": {
                  "get": "TorrentController#pauseTorrent"
                },
                "/play": {
                  "get": "TorrentController#playTorrent"
                }
              }
            }
          }
        }

        // services: [
        //   {
        //     name: 'dtorrent',
        //     service: dtorrent.manager(),
        //   },
        //   {
        //     name: 'tracker',
        //     service: require('./src/services/tracker')
        //   },
        //   {
        //     name: 'server',
        //     service: require('./src/services/server'),
        //   }
        // ]
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
    throw new Error('Unable to connect');
  }

  return true;
}
