var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer( { port: 8100 } );
const guid = require('../services/guid');
const ProcessMessage = require('../room/processMessage');
const {setUserName} = require('../services/userList');
const socketList = [];

const InitWebSocket = () => {
    wss.on('connection', function(ws){
        console.log('connected');

        ws.on('message', (msg) => {
            console. log('message from client : ' + msg);
            var data = JSON.parse(msg);
            switch(data.message){
                //유저 아이디 최초 발급(브라우저당 GUID 발급)
                case "userID":
                    var resp = {
                        status: 200,
                        message: 'userID',
                        data: guid()
                    }
                    ws.send(JSON.stringify(resp));
                    setUserName(msg.userID, msg.userName);
                    socketList.push({userID: resp.data, socket: ws});
                    break;
                //유저가 이름을 바꾸고 다시 접속했을 때, 수정할 때
                case "connect":
                    setUserName(msg.userID, msg.userName);
                    socketList.push({userID: msg.userID, socket: ws});
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