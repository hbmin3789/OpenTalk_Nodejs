var createRoom = require('./roomApis/roomCreate');
var quitRoom = require('./roomApis/quitRoom');
var enterRoom = require('./roomApis/enterRoom');


//클라이언트에서 온 메시지 처리
const ProcessMessage = (ws, data) => {
    var room = require('./roomManager');
    console.log("processMessage : " + JSON.stringify(data));
    switch(data.message){
        case "createRoom":
            createRoom(ws, data.data);
            break;
        case "quitRoom":
            quitRoom(data.data);
            break;
        case "enterRoom":
            enterRoom(ws, data.data);
            break;
        case "getRoomList":
            console.log("roomList : " + JSON.stringify(room.getRoomList()));
            ws.send(JSON.stringify({
                message: "roomList",
                roomList: room.getRoomList()
            }));
            break;
    }
}

module.exports = ProcessMessage;