const express = require('express');
const app = express();
const api = require('./routes/index');
const cors = require('cors');
const {InitWebSocket} = require('./src/network/webSocket');

const PORT = process.env;

InitWebSocket();

app.use(cors());
app.use('/api',api);
app.use(express.static('public'));

const port = 3002;
//app.listen(port, () => console.log(`Listening on port ${port}`));
app.listen(PORT);