var WebSocketServer = require('ws').Server;
const guid = require('../services/guid');
const ProcessMessage = require('../room/processMessage');
const { setUserName, getUser } = require('../services/userList');
const socketList = [];

const InitWebSocket = (server) => {
    var wss = new WebSocketServer( { server: server } );
    var room = require('../room/roomManager');
    wss.on('connection', function(ws){
        console.log('connected');

        ws.on('message', (msg) => {
            var data = JSON.parse(msg);
            switch(data.message){
                //유저 아이디 최초 발급(브라우저당 GUID 발급)
                case "userID":
                    sendUserList(ws);
                    var resp = {
                        status: 200,
                        message: 'userID',
                        data: guid()
                    }
                    ws.send(JSON.stringify(resp));
                    break;
                //다시 접속했을 때, 수정할 때
                case "connect":
                    sendUserList(ws);
                    setUserName(data.userID, data.userName);
                    socketList.push({userID: data.userID, socket: ws});
                    ws.send(JSON.stringify({
                        message: 'connect'
                    }));
                    console.log('connect Success');
                    break;
                case "offer":
                    console.log("offer user ID : " + data.caller);
                    findSocket(data.callee).socket.send(JSON.stringify({
                        message: "offer",
                        offer: data.offer,
                        caller: data.caller
                    }));
                    break;
                case 'icecandidate':
                    console.log("IceCandidate user ID : " + data.receiver);
                    findSocket(data.receiver).socket.send(JSON.stringify({
                        message: "icecandidate",
                        icecandidate: data.candidate,
                        sender: data.sender
                    }));
                    break;
                case "answer":
                    console.log("answer user ID : " + data.callee);
                    findSocket(data.caller).socket.send(JSON.stringify({
                        message: "answer",
                        answer: data.answer,
                        callee: data.callee
                    }));
                    break;
                case "chat":
                    var curRoom = room.getRoomList().find(x=>x.roomID === data.data.roomID);
                    curRoom.userList.forEach(u=>{
                        findSocket(u.userID).socket.send(JSON.stringify(data));
                    });
                    break;
                case "userList":
                    sendUserList(ws);
                    break;
                default:
                    ProcessMessage(ws, data);
                    break;
            }
        });

        ws.onclose = () => {
            console.log(ws + "disconnected");
            var socket = socketList.find(x=>x.socket === ws);
            if(socket)
                var userID = socket.userID;
            ProcessMessage(ws,{message: "disconnect", userID: userID});
        };
    });
};

const sendUserList = (ws) => {
    let list = [];
    socketList.forEach(s=>{
        var userName = getUser(s.userID);
        list.push({
            userName: userName.userName,
            userID: s.userID
        });
    });
    let userList = JSON.stringify({
        message: "userList",
        userList: list
    });
    ws.send(userList);
}

const sendMessage = (msg, userID, data) => {
    var socket = socketList.find(x=>x.userID === userID).socket;
    socket.send(JSON.stringify({
        data: data,
        message: msg
    }));
        
    console.log("send Message : " + JSON.stringify(data));
};

const broadCastMessage = (data) => {
    socketList.forEach(x => x.socket.send(JSON.stringify(data)));
};

const findSocket = (userID) => socketList.find(x=>x.userID === userID);

function onRoomCreated() {
    socketList.forEach(x => {
        x.socket.send(JSON.stringify({
            message: 'roomCreated'
        }));
    });
};

function onAdminChanged(room) {
    var s = socketList.find(x=>x.userID === room.userList[0].userID);
    s.send(JSON.stringify({
        message: 'setAdmin'
    }))
}

module.exports = {
    InitWebSocket, onAdminChanged,
    onRoomCreated, sendMessage, broadCastMessage,
    socketList
};