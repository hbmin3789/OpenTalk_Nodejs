import UserInfo from '../user/userInfo';

export class User {
    userName = "";
    userID = "";
    isAdmin = false;
};

export class RoomInfo {
    userList: Array<User> = new Array<User>();
    roomName: string = "";
    roomID: string = "";
    password: string = "";
    adminID: string = "";
};

export default RoomInfo;