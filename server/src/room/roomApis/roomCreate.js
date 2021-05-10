const { createRoom, isAdmin, quitRoom, enterRoom } = require('../roomManager');

const createRoomApi = (ws, data) => {
    var socket = require(('../../network/webSocket'));

    console.log(data.userID + 'createRoom request');
    console.log(data);
    
    //요청자가 이미 방을 만들었다면
    if(isAdmin(data.userID)){
        console.log(data.userID + "createRoomEnded : createdRoomAlready");
        return;
    }

    //방 생성
    var newRoom = createRoom(data.userID,data.roomName,data.password,data.tags);

    enterRoom(data.userID, newRoom.roomID, data.password);
    
    ws.send(JSON.stringify({
        message: 'createRoom',
        data: newRoom
    }));

    socket.onRoomCreated();
    console.log(data.userID + "createRoomEnded");
}

module.exports = createRoomApi;