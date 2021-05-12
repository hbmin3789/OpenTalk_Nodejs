import Container from '../common/container';
import {setSocketEvent} from '../network/websocketEvents';
type UserListItem = {
    userName: string,
    userID: string
};

let userList = new Array<UserListItem>();

export const InitGetUser = () => {
    setSocketEvent("userList",(data)=>{
        userList = data.userList;
    });
};

export const getUserList = () => {
    Container.socket.send(JSON.stringify({message: "userList"}));
    return userList;
};

export default getUserList;