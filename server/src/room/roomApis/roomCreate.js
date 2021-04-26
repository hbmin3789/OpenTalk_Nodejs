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
    var newRoom = createRoom(data.userID,"새 방","");

    //요청자가 참여한 방이 있다면
    if(data.curRoom.length != 0) {
        //퇴장 처리
        quitRoom(data.userID, data.curRoom);
    }

    enterRoom(data.userID, newRoom.roomID);
    
    ws.send(JSON.stringify({
        message: 'createRoom',
        data: newRoom
    }));

    socket.onRoomCreated();
    console.log(data.userID + "createRoomEnded");
}

module.exports = createRoomApi;