const dtorrent = require('dtorrent');
const api = require('./src/api');

const express = require('express');
const app = express();

dtorrent.useExpress(app);
dtorrent.start();

api(app);

app.listen(process.env.API_PORT);