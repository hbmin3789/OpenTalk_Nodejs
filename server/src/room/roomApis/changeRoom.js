const { changeRoom, isAdmin, quitRoom, enterRoom } = require('../roomManager');
const {onAdminChanged} = require('../../network/webSocket');
const changeRoomApi = (ws, curRoomID, newRoomID, userID) => {

    var room = quitRoom(curRoomID, userID);
    
    if(isAdmin(userID) === true){
        onAdminChanged(room);
    }

    enterRoom(userID, newRoomID);


}

module.exports = changeRoomApi;