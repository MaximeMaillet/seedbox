require('dotenv').config();
const server = require('http').createServer();
const io = require('socket.io')(server);
const {torrents: torrentModel, users: userModel, files: fileModel} = require('../models');
const torrentTransformer = require('../transformers/torrent');
const jwt = require('jsonwebtoken');
const {secret} = require('../config/secret_key');
const logger = require('../lib/logger');

const clients = [];
const hashs = [];
const users = [];
const events = [];

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
  const events = [];

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
          emitFromDatabase();
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

  manager.addListener({
    onAdded: (torrent) => {
      events.push({
        event: module.exports.MESSAGE.TORRENT_ADDED,
        torrent,
      });
    },
    onUpdated: (torrent) => {
      events.push({
        event: module.exports.MESSAGE.TORRENT_UPDATED,
        torrent,
      });
    },
    onRemoved: (torrent) => {
      events.push({
        event: module.exports.MESSAGE.TORRENT_REMOVED,
        torrent,
      });
    },
    onPaused: (torrent) => {
      events.push({
        event: module.exports.MESSAGE.TORRENT_PAUSED,
        torrent,
      });
    },
    onResumed: (torrent) => {
      events.push({
        event: module.exports.MESSAGE.TORRENT_RESUMED,
        torrent,
      });
    },
    onFinished: (torrent) => {
      events.push({
        event: module.exports.MESSAGE.TORRENT_FINISHED,
        torrent,
      });
    },
  });

  setInterval(emitFromEvents, 5000);
  setInterval(emitFromDatabase, 15000);

  server.listen(process.env.WS_PORT || 8091);
  logger.write({
    message: `WS listen on ${process.env.WS_PORT || 8091}`
  });
};

function send(message, content) {
  for(const i in clients) {
    if(!clients[i].user) {
      continue;
    }

    clients[i].client.emit(message, JSON.stringify(content));
  }
}

async function emitFromEvents() {
  for(const i in events) {
    const index = hashs.indexOf(events[i].torrent.hash);
    if(index !== -1) {
      send(events[i].event, Object.assign(events[i].torrent, {
        user: users[index]
      }));
    }
  }
}

async function emitFromDatabase() {
  const torrents = await torrentModel.findAll({
    where: {},
    include: [userModel, fileModel]
  });

  for (const i in clients) {
    if (!clients[i].user) {
      continue;
    }

    for (const j in torrents) {
      if (hashs.indexOf(torrents[j].hash) === -1) {
        const index = hashs.length;
        hashs[index] = torrents[j].hash;
        users[index] = torrents[j].user.dataValues;
      }
    }

    clients[i].client.emit(
      module.exports.MESSAGE.TORRENT_UPDATE,
      JSON.stringify(torrentTransformer.transform(torrents, clients[i].user))
    );
  }
}