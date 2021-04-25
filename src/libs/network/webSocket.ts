import Container from '../common/container';
import RoomInfo from '../room/roomInfo';

export const RequestRoomList = () => {
    Container.socket.send(JSON.stringify({
        message: "getRoomList"
    }));
};

export const RequestEnterRoom = (room: RoomInfo) => {

}