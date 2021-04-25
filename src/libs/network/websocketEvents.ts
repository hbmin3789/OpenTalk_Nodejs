import network from '../../../models/network';
import Container, { container } from '../common/container';

export const WebSocketEvents = (resp: any) => {
    resp = JSON.parse(resp);

    switch(resp.message){
        case 'userID':
            OnUserID(resp);
            break;
        case 'enterRoom':
            OnRoomEnter(resp);
            break;
        case 'createRoom':
            OnRoomCreate(resp);
            break;
        case 'quitRoom':
            OnRoomQuit(resp);
            break;
        case 'roomCreated':
            OnRoomCreated()
            break;
        case 'roomList':
            OnGetRoomList(resp);
            break;
    }
};

const OnUserID = (resp: any) => {
    Container.curUser.setUserID(resp.data);
}

const OnRoomEnter = (resp: any) => {
    Container.curRoomID = resp.data.curRoomID;
}

const OnRoomQuit = (resp: any) => {
    Container.curRoomID = "";
}

//다른 유저가 방을 만들었을 때
const OnRoomCreated = () => {
    console.log('roomCreated');
    Container.socket.send(JSON.stringify({
        message: 'getRoomList',
        userID: Container.curUser.getUserID()
    }));
}
let OnEnterRoom: (resp: any) => void;
let OnGetRoomList: (resp: any) => void;
let OnRoomCreate: (resp: any) => void;

export const SetOnRoomEnterEvent = (ev: (resp: any) => void) => {
    OnEnterRoom = ev;
}

export const SetOnGetRoomListEvent = (ev: (resp: any) => void)=>{
    OnGetRoomList = ev;
}

export const SetOnRoomCreate = (ev: (resp: any) => void)=>{
    OnRoomCreate = ev;
}

export default WebSocketEvents;