import UserInfo from '../user/userInfo';
import RoomTag from './roomTag';

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
    tags: RoomTag[] = [];
};

export default RoomInfo;