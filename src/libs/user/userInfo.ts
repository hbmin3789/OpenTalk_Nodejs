import {Cookies} from 'react-cookie';
import stringResources from '../../assets/stringResources';

export class UserInfo{
    userName: string = "";
    userIP: string = "";
    private userID = "";
    private cookie = new Cookies();
    getUserID = () => {
        var id = this.cookie.get(stringResources.userIDCookie);
        return (id) ? id : "";
    };
    setUserID = (id: string) => {this.cookie.set(stringResources.userIDCookie, id)};

    getUserName = () => {
        var name = this.cookie.get(stringResources.userNameCookie);
        return (name) ? name : "";
    };
    setUserName = (name: string) => this.cookie.set(stringResources.userNameCookie,name);
};

export default UserInfo;