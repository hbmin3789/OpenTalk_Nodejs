import UserInfo from '../user/userInfo';
import { Cookies } from 'react-cookie';
import stringResources from '../../assets/stringResources';
import WebSocketEvents, {setSocketEvent} from '../network/websocketEvents';
import {useHistory} from 'react-router-dom';

export class container{
     curUser: UserInfo;
     socket: WebSocket;
     curRoomID: string = "";

     constructor(){
        this.socket = new WebSocket("ws://13.125.220.137:8100");
        this.curUser = new UserInfo();

        this.socket.onmessage = (ev) => {
            console.log('message from server : ' + ev.data);
            WebSocketEvents(ev.data);
        }

        this.socket.onopen = (resp) => {
            console.log('webSocket Connected');

            setSocketEvent('connect',()=>{
                this.socket.send(JSON.stringify({
                    message: "getRoomList"
                }));
            });

            setSocketEvent('userID',(resp)=>{
                var userID = resp.data;
                if(userID)
                    this.curUser.setUserID(userID);
            });

            var msg = (Container.curUser.getUserID().length == 0) ? "userID" : "connect";
            this.socket.send(JSON.stringify({
                message: msg,
                userID: this.curUser.getUserID(),
                userName: this.curUser.getUserName()
            }));
        }
    }
}

export class MyContainer {
    static containerInst = new container();
}

export const Container = MyContainer.containerInst;
export default Container;
