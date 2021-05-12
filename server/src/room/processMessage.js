var createRoom = require('./roomApis/roomCreate');
var quitRoom = require('./roomApis/quitRoom');
var enterRoom = require('./roomApis/enterRoom');
var {getUser} = require('../services/userList');
var changeRoom = require('./roomApis/changeRoom');

var messageList = {};

var room = require('./roomManager');
messageList["changeRoom"] = (ws, data) => {
    changeRoom(ws, data);
}
messageList["createRoom"] = (ws, data) => {
    createRoom(ws, data.data);
}
messageList["quitRoom"] = (ws, data) => {
    quitRoom(ws, data.data);
}
messageList["getRoomList"] = (ws, data) => {
    console.log("roomList : " + JSON.stringify(room.getRoomList()));
    sendWebSocketMsg(ws,{
        message: "roomList",
        roomList: room.getRoomList()
    });
}
messageList["enterRoom"] = (ws, data) => {
    enterRoom(ws, data.data);
}

messageList["userName"] = (ws, data) => {
    sendWebSocketMsg(ws,{
        message: "userName",
        userID: data.userID,
        userName: getUser(data.userID).userName
    });
}
messageList["disconnect"] = (ws, data) => {
    try{
        var room = room.getRoomList().find(x=>{
            var user = x.userList.find(x=>x.userID === data);
            if(user)
                return x;
        });
        if(room)
            quitRoom(ws, {userID: data.userID, roomID: room.roomID});
    }catch{
        
    }
}

//클라이언트에서 온 메시지 처리
const ProcessMessage = (ws, data) => {
    console.log("processMessage : " + JSON.stringify(data));
    messageList[data.message](ws, data);
}

const sendWebSocketMsg = (ws, data) => {
    console.log("message to client : " + JSON.stringify(data));
    ws.send(JSON.stringify(data));
}

module.exports = ProcessMessage;