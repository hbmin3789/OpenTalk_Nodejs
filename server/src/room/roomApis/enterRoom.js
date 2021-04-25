const { enterRoom} = require('../roomManager');
const enterRoomApi = (ws, data) => {
    console.log("enter Room : " + JSON.stringify(data));
    var room = enterRoom(data.userID, data.roomID);
    if(room){
        var sendData = JSON.stringify({
            message: "enterRoom",
            data: room
        });
        console.log("messageToClient : " + JSON.stringify(sendData));
        ws.send(sendData);
    }
}

module.exports = enterRoomApi;