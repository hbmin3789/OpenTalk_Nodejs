var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer( { port: 8100 } );
const guid = require('../services/guid');
const ProcessMessage = require('../room/processMessage');

const socketList = [];

const InitWebSocket = () => {
    wss.on('connection', function(ws){
        console.log('connected');

        ws.on('message', (msg) => {
            console. log('message from client : ' + msg);
            var data = JSON.parse(msg);
            switch(data.message){
                case "userID":
                    var resp = {
                        status: 200,
                        message: 'userID',
                        data: guid()
                    }
                    ws.send(JSON.stringify(resp));
                    socketList.push({userID: resp.data, socket: ws});
                    break;
                case "connect":
                    socketList.push({userID: msg.userID, socket: ws});
                    ws.send(JSON.stringify({
                        message: 'connected'
                    }));
                    break;
                default:
                    ProcessMessage(ws, data);
                    break;
            }
        });
    });
};

const sendMessage = (msg, userID, data) => {
    var socket = socketList.find(x=>x.userID === userID).socket;
    socket.send(JSON.stringify({
        data: data,
        message: msg
    }));
        
    console.log("send Message : " + JSON.stringify(data));
};

const broadCastMessage = (data) => {
    socketList.forEach(x => x.socket.send(data));
};

function onRoomCreated() {
    socketList.forEach(x => {
        x.socket.send(JSON.stringify({
            message: 'roomCreated'
        }));
    });
};

module.exports = {
    InitWebSocket, 
    onRoomCreated, sendMessage, broadCastMessage,
    socketList
};