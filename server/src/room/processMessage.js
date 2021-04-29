var createRoom = require('./roomApis/roomCreate');
var quitRoom = require('./roomApis/quitRoom');
var enterRoom = require('./roomApis/enterRoom');
var getUserName = require('../services/userList');
var {getRoomList} = require('./roomManager.js');

//클라이언트에서 온 메시지 처리
const ProcessMessage = (ws, data) => {
    var room = require('./roomManager');
    console.log("processMessage : " + JSON.stringify(data));
    switch(data.message){
        case "createRoom":
            createRoom(ws, data.data);
            break;
        case "quitRoom":
            quitRoom(ws, data.data);
            break;
        case "enterRoom":
            enterRoom(ws, data.data);
            break;
        case "getRoomList":
            console.log("roomList : " + JSON.stringify(room.getRoomList()));
            sendWebSocketMsg(ws,{
                message: "roomList",
                roomList: room.getRoomList()
            });
            break;
        case "userName":
            sendWebSocketMsg(ws,{
                message: "userName",
                userID: data.userID,
                userName: getUserName(data.userID)
            });
            break;
        case "disconnect":
            var room = getRoomList().find(x=>{
                var user = x.userList.find(x=>x.userID === data);
                return (user);
            });
            if(room){
                var user = room.find(x=>x.userID === data);
                if(user)
                    quitRoom(ws, {userID: user.userID, roomID: room.roomID});
            }
            break;
    }
}

const sendWebSocketMsg = (ws, data) => {
    console.log("message to client : " + JSON.stringify(data));
    ws.send(JSON.stringify(data));
}

module.exports = ProcessMessage;