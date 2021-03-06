require('dotenv').config();
const path = require('path');
const express = require('express');
const router = require('express-imp-router');
const bodyParser = require('body-parser');
const dTorrent = require('dtorrent');
const webSocket = require('./src/websocket');
const logger = require('./src/lib/logger');
const torrentListener = require('./src/listeners/torrents');
const config = require('./src/config');


start()
  .catch((e) => {
    console.log(e);
  });

async function start() {
  let isReady = false;
  do {
    try {
      isReady = await checkDatabaseConnection();
      logger.write('Database ready');
    } catch(e) {
      isReady = false;
      await sleep(5000);
    }
  } while(!isReady);

  await initApi();
  await initTorrentListener();
  // await initWebSocket();
  await initTorrent();
}

async function initTorrent() {
  for(const i in config.torrent.servers) {
    await dTorrent.start({
      ...config.torrent.servers[i],
    });
  }
}

async function initApi() {
  try {
    const app = express();
    router(app);
    router.enableDebug();
    router.route([
      {
        controllers: `${path.resolve('.')}/src/controllers`,
        middlewares: `${path.resolve('.')}/src/middlewares`,
        routes: {
          [router.IMP.MIDDLEWARE]: [
            {
              controllers: ['cors#apply', bodyParser.json(), bodyParser.urlencoded({extended: true}), 'locale#extract'],
              level: router.MIDDLEWARE.LEVEL.GLOBAL,
              inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
            },
            {
              controllers: ['error-handler#handle'],
              level: router.MIDDLEWARE.LEVEL.ERROR,
              inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
            },
          ],
          '/api': {
            [router.IMP.MIDDLEWARE]: [
              {
                controllers: ['api#jwt', 'api#rewriteSession'],
                inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
              }
            ],
            '/authentication': {
              '/login': {
                post: 'AuthenticateController#login'
              },
              '/confirm': {
                get: 'AuthenticateController#confirm'
              },
              '/forgot': {
                post: 'AuthenticateController#forgotPassword'
              },
              '/password':{
                get: 'AuthenticateController#passwordForm',
                post: 'AuthenticateController#passwordSet'
              }
            },
            '/users': {
              post: 'UserController#create',
              get: 'UserController#getAll',
              '/:userId': {
                get: 'UserController#getOne',
                patch: 'UserController#update',
                delete: 'UserController#delete',
                '/picture': {
                  [router.IMP.MIDDLEWARE]: [
                    {
                      controllers: ['upload#picture'],
                      method: router.METHOD.PATCH,
                      inheritance: router.MIDDLEWARE.INHERITANCE.NONE,
                    },
                  ],
                  patch: 'UserController#picture',
                },
                '/torrents': {
                  get: 'TorrentController#getForUser'
                }
              }
            },
            '/servers': {
              get: 'ServerController#getAll'
            },
            '/torrents': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['upload#torrent'],
                  method: router.METHOD.POST,
                  inheritance: router.MIDDLEWARE.INHERITANCE.NONE,
                },
              ],
              get: 'TorrentController#getAll',
              post: 'TorrentController#create',
              '/:torrentId([0-9]+)': {
                get: 'TorrentController#getOneWithId',
                delete: 'TorrentController#remove',
                '/resume': {
                  get: 'TorrentController#resume'
                },
                '/pause': {
                  get: 'TorrentController#pause'
                },
                '/files': {
                  '/:fileId([0-9]+)': {
                    get: 'TorrentController#getFile'
                  }
                }
              },
              '/:hash':{
                get: 'TorrentController#getOneWithHash',
                delete: 'TorrentController#remove',
                '/resume': {
                  get: 'TorrentController#resume'
                },
                '/pause': {
                  get: 'TorrentController#pause'
                },
                '/files': {
                  '/:fileId([0-9]+)': {
                    get: 'TorrentController#getFile'
                  }
                }
              },
            },
          },
          '/static': {
            '/profile': {
              [router.IMP.STATIC]: {
                'targets': [`.${config.api.user.directory.replace(path.resolve('.'), '')}`],
              }
            }
          }
        },
      }
    ]);
    app.listen(process.env.API_PORT);
    logger.write(`App listen on ${process.env.API_PORT}`, logger.LEVEL.DEBUG);
  } catch(e) {
    logger.write(`API Error : ${e.message}`, logger.LEVEL.ERROR);
  }
}

async function initWebSocket() {
  await webSocket.start((await dTorrent.manager()));
}

async function initTorrentListener() {
  await torrentListener.start();
}

/**
 * Check database connection
 * @return {Promise.<boolean>}
 */
async function checkDatabaseConnection() {
  const Sequelize = require('./src/models');
  const err = await Sequelize.sequelize.authenticate();

  if(err) {
    throw new Error('Unable to connect');
  }
  return true;
}

/**
 * @param ms
 * @returns {Promise<any>}
 */
async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}