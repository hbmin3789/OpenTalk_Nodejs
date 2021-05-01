const express = require('express');
const app = express();
const api = require('./routes/index');
const cors = require('cors');
const {InitWebSocket} = require('./src/network/webSocket');
const path = require('path');

const PORT = 3002;

InitWebSocket();

app.use(cors());
app.use('/api',api);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));