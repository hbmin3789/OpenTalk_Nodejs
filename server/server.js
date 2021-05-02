const express = require('express');
const app = express();
const api = require('./routes/index');
const cors = require('cors');
const {InitWebSocket} = require('./src/network/webSocket');
const path = require('path');
const fs = require('fs');
const https = require('https');

const PORT = 3002;

InitWebSocket();

app.use(cors());
app.use('/api',api);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const options = {
  key: fs.readFileSync(__dirname + '/cert/rootca.key'),
  cert: fs.readFileSync(__dirname + '/cert/rootca.crt')
};

https.createServer(options, app).listen(3030);