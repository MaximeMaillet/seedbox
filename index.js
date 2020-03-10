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


//     router(app);
//     router.enableDebug();
//     router.route([
//       {
//         controllers: `${__dirname}/${environment.api.controllers}`,
//         middlewares: `${__dirname}/${environment.api.middlewares}`,
//         routes: {
//           "/api": {
//             [router.IMP.MIDDLEWARE]: [
//               {
//                 controllers: ['cors#apply'],
//                 level: router.MIDDLEWARE.LEVEL.GLOBAL,
//               },
//               {
//                 controllers: [bodyParser.json(), 'api#jwt', 'api#rewriteSession'],
//                 inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
//               },
//               {
//                 controllers: ['errors#apply'],
//                 inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
//                 level: router.MIDDLEWARE.LEVEL.ERROR,
//               }
//             ],
//             "/authenticate": {
//               "/login": {
//                 post: "AuthenticateController#login"
//               },
//               "/confirm": {
//                 get: "AuthenticateController#confirm"
//               },
//               "/logout": {
//                 get: "AuthenticateController#logout"
//               },
//               "/subscribe": {
//                 post: "AuthenticateController#subscribe"
//               },
//               "/forgot": {
//                 post: "AuthenticateController#forgot"
//               },
//               "/password": {
//                 post: "AuthenticateController#passwordPost",
//               }
//             },
//             "/users": {
//               get: "UserController#getUsers",
//               "/:id": {
//                 get: "UserController#getUser",
//                 patch: "UserController#patchUser",
//                 delete: "UserController#deleteUser"
//               }
//             },
//             "/torrents": {
//               [router.IMP.MIDDLEWARE]: {
//                 controllers: ['upload#torrentFiles'],
//                 method: router.METHOD.POST,
//               },
//               get: "TorrentController#getTorrents",
//               post: "TorrentController#postTorrent",
//               "/:id": {
//                 get: "TorrentController#getTorrent",
//                 delete: "TorrentController#remove",
//                 "/download/:fileId/:name": {
//                   get: "TorrentController#downloadFile"
//                 },
//                 "/pause": {
//                   get: "TorrentController#pauseTorrent"
//                 },
//                 "/play": {
//                   get: "TorrentController#playTorrent"
//                 }
//               }
//             }
//           }
//         }
//       }
//     ]);
//
//     app.listen(process.env.API_PORT);
//     logger.write({
//       message: `API launched at port ${process.env.API_PORT}`
//     });
//   } catch(e) {
//     logger.write(e, logger.LEVEL.ERROR);
//   }
// }

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
              controllers: ['cors#apply', bodyParser.json(), bodyParser.urlencoded({extended: true})],
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
              '/:id': {
                get: 'UserController#getOne',
                patch: 'UserController#update',
                delete: 'UserController#delete',
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