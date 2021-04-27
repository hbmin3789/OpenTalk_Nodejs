var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer( { port: 8100 } );
const guid = require('../services/guid');
const ProcessMessage = require('../room/processMessage');
const { setUserName } = require('../services/userList');
const socketList = [];

const InitWebSocket = () => {
    wss.on('connection', function(ws){
        console.log('connected');

        ws.on('message', (msg) => {
            console.log('message from client : ' + msg);
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
                    break;
                //다시 접속했을 때, 수정할 때
                case "connect":
                    setUserName(data.userID, data.userName);
                    socketList.push({userID: data.userID, socket: ws});
                    ws.send(JSON.stringify({
                        message: 'connect'
                    }));
                    console.log('connect Success');
                    break;
                default:
                    ProcessMessage(ws, data);
                    break;
            }
        });

        ws.onclose = () => {
            console.log(ws + "disconnected");
            var socket = socketList.find(x=>x.socket === ws);
            var userID = socket.userID;
            ProcessMessage(ws,{message: "disconnect", userID: userID});
        };
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