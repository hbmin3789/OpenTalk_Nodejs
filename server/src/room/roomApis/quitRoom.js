var { quitRoom } = require('../roomManager');

//TODO : 방 퇴장 처리
const quitRoomApi = (data) => {
    quitRoom(data.userID,data.roomID);
}

module.exports = quitRoomApi;