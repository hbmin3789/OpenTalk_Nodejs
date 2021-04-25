import UserInfo from '../user/userInfo';

export class RoomInfo {
    userList: Array<UserInfo> = new Array<UserInfo>();
    roomName: string = "";
    roomID: string = "";
    password: string = "";
    adminID: string = "";
};

export default RoomInfo;