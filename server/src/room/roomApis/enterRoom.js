const { enterRoom} = require('../roomManager');
const getUserName = require('../../services/userList');

const enterRoomApi = (ws, data) => {
    var {socketList} = require('../../network/webSocket');

    console.log("enter Room : " + JSON.stringify(data));
    var room = enterRoom(data.userID, data.roomID, data.password);
    if(room){
        
        var sendData = JSON.stringify({
            message: "enterRoom",
            data: room
        });

        console.log("messageToClient : " + JSON.stringify(sendData));
        ws.send(sendData);

        room.userList.forEach(user => {
            var item = socketList.find(x=>x.userID === user.userID);
            item.socket.send(JSON.stringify({
                message: 'userEnter',
                data: {
                    userName: getUserName.getUser(data.userID).userName,
                    userID: data.userID,
                }
            }));
        });
    }else{
        let sendData = JSON.stringify({
            message: "passwordDenied",
        });
        console.log("messageToClient : " + JSON.stringify(sendData));
        ws.send(sendData);
    }
}

module.exports = enterRoomApi;