import React from 'react';
import styled,{keyframes} from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';
import Container from '../../libs/common/container';
import { setSocketEvent } from '../../libs/network/websocketEvents';
import {useHistory} from 'react-router-dom';
import RoomDetail from './RoomDetail';
import {Call, addUserList, Hangup} from '../../libs/webrtc/callManager';
import RoomListItem from './RoomListItem';
import UserInfoNav from './UserInfoNav';
import MessageBox from './MessageBox';
import PasswordMessage from './PasswordMessage';

//#region styles

const Background = styled.div`
    position: absolute;  
    display: flex;
    background-color: white;
    width: 100%;
    height: 100%;
    top: 0%;
    text-align: left;
    align-items: flex-start;
`;

const RoomArea = styled.div`
`;

const RoomListView = styled.ul`
    margin: 2rem;
    list-style-type: none;
    padding: 0px;
    padding-bottom: 1rem;    
`;

const SearchBox = styled.input`
    display: inline-block;
    font-size: 1.3rem;
    margin: 2rem;
    padding: 0.5rem;
    border-color: #dddddd;
    border-width: 0.2rem;
    border-style: solid;
    width: 30rem;
    &:focus{
        outline: none;
    }
`;

//#endregion

let loaded;

export const RoomList = () => {
    let [selectedRoom, setSelectedRoom] = React.useState<RoomInfo>();
    let [roomList, setRoomList] = React.useState<Array<RoomInfo>>(new Array<RoomInfo>());
    let [keyWord, setKeyWord] = React.useState<string>("");

    let [displayMessage, setDisplayMessage] = React.useState<boolean>(false);
    let [messageBoxContent, setMessageBoxContent] = React.useState<string>("");

    let [displayPassword, setDisplayPassword] = React.useState<boolean>(false);
    let [passwordRoom, setPasswordRoom] = React.useState<RoomInfo>(new RoomInfo());

    setSocketEvent('roomList',(data: any) => {
        setRoomList(data.roomList);
    });

    setSocketEvent('createRoom', (data: any) => {
        Container.curRoomID = data.data.roomID;
        setSelectedRoom(data.data);
    });

    setSocketEvent('enterRoom', (data: any) => {
        console.log("room enter");
        var room = data.data as RoomInfo;
        setSelectedRoom(room);
        room.userList.forEach(x=>{
            if(x.userID === Container.curUser.getUserID()){
                return;
            }
            addUserList(x.userID);
            Call(x.userID);
        })

        console.log(data.data);
    });

    setSocketEvent('passwordDenied', (data: any)=>{
        console.log("password denied");
        setDisplayMessage(true);
        setMessageBoxContent("비밀번호가 틀렸습니다.");
    });

    setSocketEvent('roomCreated', (data: any) => {
        Container.socket.send(JSON.stringify({
            message: "getRoomList"
        }));
    });

    var history = useHistory();
    let userName = Container.curUser.getUserName();

    if(!userName || userName.length === 0){
        console.log(history);
        
        history.push('/SignIn');
    }

    const onRoomClicked = (room: RoomInfo) => {
        if(room.password.length === 0){
            enterRoom(room, "");
            return;
        }
        setPasswordRoom(room);
        setDisplayPassword(true);
    }    

    const enterRoom = (room: RoomInfo, password: string) => {
        setDisplayPassword(false);
        if(selectedRoom?.roomID === room.roomID){
            return;
        }

        if(selectedRoom === undefined){
            Container.socket.send(JSON.stringify({
                message: "enterRoom",
                data: {
                    roomID: room.roomID,
                    password: password,
                    userID: Container.curUser.getUserID(),
                }
            }));
        }
        
        else{
            Container.socket.send(JSON.stringify({
                message: "changeRoom",
                data: {
                    curRoomID: selectedRoom.roomID,
                    newRoomID: room.roomID,
                    password: "",
                    userID: Container.curUser.getUserID(),
                }
            }));
        }
        
    }

    const onQuitBtnPressed = ()=>{
        if(selectedRoom)
            Hangup(selectedRoom.userList);

        Container.socket.send(JSON.stringify({
            message: 'quitRoom',
            data: {
                userID: Container.curUser.getUserID(),
                roomID: selectedRoom?.roomID
            }
        }));

        Container.curRoomID = "";
        setSelectedRoom(undefined);
    };

    const onCreateButtonClicked = () => {
        history.push('CreateRoom');
    }

    return (
        <div>
            {selectedRoom ? 
            <RoomDetail room={selectedRoom} OnQuitBtnPressed={()=>{onQuitBtnPressed()}}>

            </RoomDetail> : 
            <div>
            <Background>
                <UserInfoNav createButtonClicked={onCreateButtonClicked}></UserInfoNav>
                <RoomArea>
                    <SearchBox placeholder={"검색"} onChange={(e)=>{
                        setKeyWord(e.target.value);
                    }}></SearchBox>
                    <RoomListView>
                        {roomList.filter(x=>x.roomName.includes(keyWord)).map(x=><RoomListItem key={x.roomID} onclick={()=>{
                            onRoomClicked(x);
                        }} roomInfo={x}></RoomListItem>)}
                    </RoomListView>
                </RoomArea>
            </Background>
            <MessageBox setDisplay={setDisplayMessage} display={displayMessage} message={messageBoxContent}></MessageBox>
            <PasswordMessage confirm={(room, password)=>enterRoom(room, password)} 
                             cancel={()=>setDisplayPassword(false)}
                             room={passwordRoom}
                             display={displayPassword}></PasswordMessage>
            </div>

            
            }
        </div>
        
    )
};

export default RoomList;