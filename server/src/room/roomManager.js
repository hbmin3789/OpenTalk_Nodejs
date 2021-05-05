const guid = require('../services/guid');
const socketList = require('../network/webSocket');
const {getUser} = require('../services/userList');
var roomList = [];

const getRoomList = () => roomList;

//방을 생성함. 기본 이름 : 새 방
//TODO : 방을 생성할 때 이름을 지정하면 좋을듯
const createRoom = (userID, roomName, password) => {
    var room = {
        adminID: userID,
        roomName: roomName,
        password: password,
        roomID: guid(),
        userList: []
    };

    roomList.push(room);
    console.log(room.roomName + "room created");

    return room;
}

//방의 정보를 변경함
const updateRoom = (roomID, userID, roomName, password) => {
    console.log(roomID + "room updated");
    roomList.forEach(room => {
        if(room.roomID === roomID){
            room.adminID = userID;
            room.roomName = roomName;
            room.password = password;
        }
    });
}

//방을 지움
const deleteRoom = (roomID) => {
    console.log(roomID + "room deleted");
    var idx = roomList.findIndex(x => x.roomID === roomID);
    var room = roomList[idx];

    //유저 퇴장처리
    room.userList.forEach(userID => {
        quitRoom(userID, roomID);
    });

    roomList.splice(idx);
}

//채팅방 입장
const enterRoom = (userID, roomID) => {
    console.log(userID + " entered to " + roomID);
    var room = roomList.find(x => x.roomID === roomID);
    if(room){
        var user = room.userList.find(x=>x.userID === userID);
        if(!user){
            room.userList.push(getUser(userID));
            return room;
        }
    }
}

//채팅방 퇴장
const quitRoom = (userID, roomID) => {
    console.log(userID + " quit from " + roomID);
    var room = roomList.find(x => x.roomID === roomID);
    if(room){
        var idx = room.userList.findIndex(x=>x === userID);
        room.userList.splice(idx);
        if(room.userList.length === 0){
            var idx = roomList.findIndex(room);
            roomList.splice(idx);
            console.log(roomList);
            return undefined;
        }
    }
    return room;
}

//유저가 방장이면 true리턴
const isAdmin = (userID) => (roomList.find(room => room.adminID === userID));

module.exports = {
    createRoom, updateRoom, deleteRoom,
    enterRoom, quitRoom, getRoomList,
    isAdmin};