const guid = require('../services/guid');
const socketList = require('../network/webSocket');
const {getUser} = require('../services/userList');
var roomList = [];

const getRoomList = () => roomList;

//방을 생성함. 기본 이름 : 새 방
//TODO : 방을 생성할 때 이름을 지정하면 좋을듯
const createRoom = (userID, roomName, password, tags) => {
    let newRoomID = guid();
    var room = {
        adminID: userID,
        roomName: roomName,
        password: password,
        roomID: newRoomID,
        userList: [],
        tags: tags
    };

    roomList.push(room);
    console.log(room);
    console.log("room created");

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
    room.userList.forEach(user => {
        quitRoom(user.userID, roomID);
    });

    roomList.splice(idx, 1);
}

//채팅방 입장
const enterRoom = (userID, roomID, password) => {
    console.log(userID + " entered to " + roomID);
    var room = roomList.find(x => x.roomID === roomID);
    if(room.password !== password)
        return undefined;
    if(room){
        var user = room.userList.find(x=>x.userID === userID);
        if(!user){
            let user = getUser(userID);
            if(!user)
                return undefined;
            room.userList.push();
            return room;
        }
    }
}

//채팅방 퇴장
const quitRoom = (userID, roomID) => {
    console.log(userID + " quit from " + roomID);
    var room = roomList.find(x => x.roomID === roomID);
    if(room){
        var idx = room.userList.findIndex(x=>x.userID === userID);
        room.userList.splice(idx,1);
        if(room.userList.length === 0) {
            var idx = roomList.findIndex(x=>x===room);
            roomList.splice(idx,1);
            return undefined;
        } else {
            if(room.adminID === userID){
                room.adminID = room.userList[0].userID;
            }
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