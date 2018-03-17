require('dotenv').config();
const server = require('http').createServer();
const io = require('socket.io')(server);
const {torrents: torrentModel, users: userModel, files: fileModel} = require('../models');
const torrentTransformer = require('../transformers/torrent');
const jwt = require('jsonwebtoken');
const {secret} = require('../config/secret_key');

const clients = [];

module.exports.MESSAGE = {
  PING: 'ping',
  TORRENT_ADDED: 'tr.added',
  TORRENT_REMOVED: 'tr.removed',
  TORRENT_UPDATED: 'tr.updated',
  TORRENT_PAUSED: 'tr.paused',
  TORRENT_RESUMED: 'tr.resumed',
  TORRENT_FINISHED: 'tr.finished',
  TORRENT_UPDATE: 'tr.bdd.update',
  USER_CONNECT: 'us.connect',
};

module.exports.start = async(dtorrent) => {
  const manager = await dtorrent.manager();

  manager.addListener({
    onAdded: (torrent) => {
      send(module.exports.MESSAGE.TORRENT_ADDED, torrent);
    },
    onUpdated: (torrent) => {
      send(module.exports.MESSAGE.TORRENT_UPDATED, torrent);
    },
    onRemoved: (torrent) => {
      send(module.exports.MESSAGE.TORRENT_REMOVED, torrent);
    },
    onPaused: (torrent) => {
      send(module.exports.MESSAGE.TORRENT_PAUSED, torrent);
    },
    onResumed: (torrent) => {
      send(module.exports.MESSAGE.TORRENT_RESUMED, torrent);
    },
    onFinished: (torrent) => {
      send(module.exports.MESSAGE.TORRENT_FINISHED, torrent);
    },
  });

  io.on('connection', (client) => {
    if(clients.indexOf(client) === -1) {
      clients[client.id] = {
        user: null,
        client,
      };
      client.emit(module.exports.MESSAGE.USER_CONNECT, JSON.stringify({message: 'who are you ?'}));
    }

    client.on(module.exports.MESSAGE.USER_CONNECT, async(data) => {

      try {
        const decoded = jwt.verify(data, secret);
        const user = await userModel.find({where: {id: decoded.user.id}});
        if(user) {
          clients[client.id].user = user;
        } else {
          client.disconnect();
        }
      } catch(err) {
        client.disconnect();
      }
    });

    client.on('disconnect', () => {
      delete clients[client.id];
    });
  });

  setInterval(
    async() => {
      const torrents = await torrentModel.findAll({
        where: {},
        include: [userModel, fileModel]
      });

      for (const i in clients) {
        if (!clients[i].user) {
          continue;
        }

        clients[i].client.emit(
          module.exports.MESSAGE.TORRENT_UPDATE,
          JSON.stringify(torrentTransformer.transform(torrents, clients[i].user))
        );
      }
    }, 5000
  );

  server.listen(process.env.WS_PORT);
};

function send(message, content) {
  for(const i in clients) {
    clients[i].client.emit(message, JSON.stringify(content));
  }
}