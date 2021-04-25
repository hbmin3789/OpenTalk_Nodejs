import {Cookies} from 'react-cookie';

export class UserInfo{
    userName: string = "";
    userIP: string = "";
    private userID = "";
    private cookie = new Cookies();
    getUserID = () => {
        var id = this.cookie.get('userID');
        return (id) ? id : "";
    };
    setUserID = (id: string) => {this.cookie.set('userID', id)};
};

export default UserInfo;