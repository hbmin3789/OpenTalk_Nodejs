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
import RoomTag from '../../libs/room/roomTag';

//#region styles

const Background = styled.div`
    position: absolute;  
    display: block;
    background-color: #fafafa;
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

const Header = styled.div`
    content: '';
    text-align: center;
    background: white;
    align-items: center;
    height: 5rem;
`;

const SearchBox = styled.input`    
    margin-top: 1rem;
    font-size: 1.3rem;
    padding: 0.5rem 1rem;
    border-color: #dddddd;
    border-style: solid;
    border-radius: 2rem;
    &:focus{
        outline: none;
    }
`;

const UserName = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
    font-size: 2rem;
`;

const RoomCreateButton = styled.button`
    position: absolute;
    top: 1rem;
    left: 1rem;
    border-radius: 5px;
    border-width: 1px;
    background-color: #f6f6f6;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.5rem;
    &:focus{
        outline: none;
    }
    &:hover{
        background-color: #efefef;
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
            <Background>
                <Header>
                    <RoomCreateButton onClick={onCreateButtonClicked}>방 만들기</RoomCreateButton>
                    <SearchBox placeholder={"검색"} onChange={(e)=>{
                        setKeyWord(e.target.value);
                    }}></SearchBox>
                </Header>
                <RoomListView>
                    {roomList.filter(x=>x.roomName.includes(keyWord)).map(x=><RoomListItem key={x.roomID} onclick={()=>{
                        onRoomClicked(x);
                    }} roomInfo={x}></RoomListItem>)}
                </RoomListView>
                <MessageBox setDisplay={setDisplayMessage} display={displayMessage} message={messageBoxContent}></MessageBox>
                <PasswordMessage confirm={(room, password)=>enterRoom(room, password)} 
                                cancel={()=>setDisplayPassword(false)}
                                room={passwordRoom}
                                display={displayPassword}></PasswordMessage>
                <UserName>{Container.curUser.getUserName()}</UserName>
            </Background>
            
            }
        </div>
        
    )
};

export default RoomList;