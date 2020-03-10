require('dotenv').config();

module.exports = {
  "tracker": {
  },
  logger: {
    mode: "console",
    directory: "logs"
  },
  // "api": {
  //   "routes": "src/config/routes.json",
  //   "middlewares": "src/middlewares",
  //   "controllers": "src/controllers",
  //   "base_url": "https://seedbox.deuxmax.fr",
  //   "front_url": "https://seedbox.deuxmax.fr"
  // },
  api: {
    torrent: {
      temp_directory: '/var/app/public'
    }
  },
  api_url: process.env.API_URL,
  base_url: process.env.BASE_URL,
  mailer: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    sender: process.env.SMTP_SENDER,
  },
  authentication: {
    jwt_secret: process.env.JWT_SECRET,
  },
  torrent: {
    servers: [
      {
        name: "PrimaryServer",
        client: 'rtorrent',
        interval_check: 1000,
        secure: false,
        host: process.env.RTORRENT_HOST,
        port: process.env.RTORRENT_PORT,
        endpoint: process.env.RTORRENT_PATH,
        auth: {
          user: 'rtorrent',
          password: 'rtorrent',
        }
      }
    ]
  }
};