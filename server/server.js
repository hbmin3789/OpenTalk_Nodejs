const express = require('express');
const app = express();
const api = require('./routes/index');
const cors = require('cors');
const {InitWebSocket} = require('./src/network/webSocket');
const path = require('path');
const fs = require('fs');
const https = require('https');

app.use(cors());
app.use('/api',api);

const options = {
  ca: fs.readFileSync(__dirname + '/cert/prescript.kro.kr_202105031X76.key.pem'),
  key: fs.readFileSync(__dirname + '/cert/prescript.kro.kr_202105031X76.key.pem'),
  cert: fs.readFileSync(__dirname + '/cert/prescript.kro.kr_202105031X76.crt.pem')
};

const server = https.createServer(options, app).listen(3030);
InitWebSocket(server);