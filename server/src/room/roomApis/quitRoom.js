var { quitRoom } = require('../roomManager');

//TODO : 방 퇴장 처리
const quitRoomApi = (ws, data) => {
    var {socketList} = require('../../network/webSocket');
    var socket = require(('../../network/webSocket'));

    var room = quitRoom(data.userID, data.roomID);
    if(room) {
        room.userList.forEach(user => {
            var item = socketList.find(x=>x.userID === user.userID);
            item.socket.send(JSON.stringify({
                message: 'userLeave',
                userID: data.userID
            }));
            console.log("userLeave : " + user.userID);
        });
    }
    socket.onRoomCreated();
}

module.exports = quitRoomApi;