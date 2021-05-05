var WebSocketServer = require('ws').Server;
const guid = require('../services/guid');
const ProcessMessage = require('../room/processMessage');
const { setUserName } = require('../services/userList');
const socketList = [];

const InitWebSocket = (server) => {
    var wss = new WebSocketServer( { server: server } );
    var room = require('../room/roomManager');
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
                case "offer":
                    console.log("offer user ID : " + data.userID);
                    //자신이 있는 방의 모든 유저들에게 연결 요청
                    //자신은 뺌
                    //자신의 ID를 넘겨줘서 Answer를 받음
                    //서로 Offer, Answer가 되어야하는데 어차피 각각
                    //Offer를 보내면 Answer가 한번씩 가서
                    //상관없을듯
                    findSocket(data.reqUserID).socket.send(JSON.stringify({
                        message: "offer",
                        offer: data.offer,
                        userID: data.userID
                    }));                                           
                    selectedRoom.userList.forEach(x=>{
                        if(x.userID === data.userID)
                            return;
                    });
                    break;
                case 'icecandidate':
                    console.log("IceCandidate user ID : " + data.userID);
                    var selectedRoom = room.getRoomList()
                                           .find(x=>x.userList.find(x=>x.userID === data.userID));
                    selectedRoom.userList.forEach(x=>{
                        if(x.userID === data.userID)
                            return;
                        findSocket(x.userID).socket.send(JSON.stringify({
                            message: "icecandidate",
                            icecandidate: data.candidate
                        }));
                    });
                    break;
                case "answer":
                    console.log("answer user ID : " + data.userID);
                    findSocket(data.answerUserID).socket.send(JSON.stringify({
                        message: "answer",
                        answer: data.answer,
                        userID: data.answerUserID
                    }));
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