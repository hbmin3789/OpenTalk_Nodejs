var WebSocketServer = require('ws').Server;
const guid = require('../services/guid');
const ProcessMessage = require('../room/processMessage');
const { setUserName, getUser } = require('../services/userList');
const socketList = [];
const SocketEvents = {};
var room = require('../room/roomManager');

SocketEvents["userID"] = (ws, data) => {
    sendUserList(ws);
    var resp = {
        status: 200,
        message: 'userID',
        data: guid()
    };
    ws.send(JSON.stringify(resp));
}

SocketEvents["connect"] = (ws, data) => {
    sendUserList(ws);
    setUserName(data.userID, data.userName);
    socketList.push({userID: data.userID, socket: ws});
    ws.send(JSON.stringify({
        message: 'connect'
    }));
    console.log('connect Success');
}

SocketEvents["offer"] = (ws, data) => {
    console.log("offer user ID : " + data.caller);
    findSocket(data.callee).socket.send(JSON.stringify({
        message: "offer",
        offer: data.offer,
        caller: data.caller
    }));
}

SocketEvents["icecandidate"] = (ws, data) => {
    console.log("IceCandidate user ID : " + data.receiver);
    findSocket(data.receiver).socket.send(JSON.stringify({
        message: "icecandidate",
        icecandidate: data.candidate,
        sender: data.sender
    }));
}

SocketEvents["answer"] = (ws, data) => {
    console.log("answer user ID : " + data.callee);
    findSocket(data.caller).socket.send(JSON.stringify({
        message: "answer",
        answer: data.answer,
        callee: data.callee
    }));
}

SocketEvents["chat"] = (ws, data) => {
    var curRoom = room.getRoomList().find(x=>x.roomID === data.data.roomID);
    curRoom.userList.forEach(u=>{
        findSocket(u.userID).socket.send(JSON.stringify(data));
    });
}

SocketEvents["userList"] = (ws, data) => {
    sendUserList(ws);
}


const InitWebSocket = (server) => {
    var wss = new WebSocketServer( { server: server } );

    wss.on('connection', function(ws){
        console.log('connected');

        ws.on('message', (msg) => {
            var data = JSON.parse(msg);
            if(SocketEvents[data.message] === undefined){
                ProcessMessage(ws, data);
                return;
            }
            SocketEvents[data.message](ws, data);
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