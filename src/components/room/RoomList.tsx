import React from 'react';
import styled,{keyframes} from 'styled-components';
import Cookies from 'universal-cookie';
import stringResources from '../../assets/stringResources';
import RoomInfo from '../../libs/room/roomInfo';
import axios from 'axios';
import Container, { container } from '../../libs/common/container';
import User, { UserInfo } from '../../libs/user/userInfo';
import { setSocketEvent } from '../../libs/network/websocketEvents';
import {useHistory} from 'react-router-dom';
import RoomDetail from './RoomDetail';
import {Call, addUserList, Hangup} from '../../libs/webrtc/callManager';
import RoomListItem from './RoomListItem';
import UserInfoNav from './UserInfoNav';

//#region styles

const Background = styled.div`
    margin-top: 0;
    background-color: #8a8aff;
    width: 100%;
    height: 100%;
    top: 0%;
    padding-top: 3rem;
    text-align: center;
`;

const ListLayout = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 50%;
    height: 50%;
`;

const RoomListView = styled.ul`
    margin-top: 3rem;
    margin-left: 7rem;
    margin-right: 3rem;
    margin-bottom: 0px;    
    list-style-type: none;
    padding: 0px;
    padding-bottom: 1rem;
`;

const SearchBox = styled.input`
    display: inline-block;
    margin: 0 auto;
    font-size: 2.5rem;
    border-radius: 10px;
    border-color: white;
    border-width: 1rem;

    &:focus{
        outline: none;
    }
`;

const RoomCreateButtonAnimation = keyframes`
    0%{box-shadow: 0px 0px 0px 0px rgb(0, 0, 0);}
    100%{box-shadow: 2px 2px 1px 1px rgb(0, 0, 0);}
`;

const RoomCreateButton = styled.button`
    position: absolute;
    font-size: 2rem;
    right: 3rem;
    cursor: pointer;
    background-color: white;
    border: none;
    border-radius: 5px;
    &:hover{
        animation-name: ${RoomCreateButtonAnimation};
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
    }
`;

//#endregion

let loaded;

export const RoomList = () => {
    var cookie = new Cookies();
    var [selectedRoom, setSelectedRoom] = React.useState<RoomInfo>();
    var [roomList, setRoomList] = React.useState<Array<RoomInfo>>(new Array<RoomInfo>());

    window.addEventListener('resize', () => {
        if(window.innerWidth <= 830){
            //반응형(모바일)
        }
    });

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
        room.userList.forEach(x=>{
            if(x.userID === Container.curUser.getUserID()){
                return;
            }
            addUserList(x.userID);
            Call(x.userID);
        })

        console.log(data.data);
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

    const onRoomCreateClicked = () => {
        var msg = JSON.stringify({
            message: 'createRoom',
            data:{
                userID: Container.curUser.getUserID(),
                curRoom: Container.curRoomID,
            }});                     
        Container.socket.send(msg);
        console.log('message To Server' + msg);
    }

    const onRoomClicked = (room: RoomInfo) => {
        setSelectedRoom(room);
        if(selectedRoom?.roomID === room.roomID){
            return;
        }

        if(selectedRoom === undefined){
            Container.socket.send(JSON.stringify({
                message: "enterRoom",
                data: {
                    roomID: room.roomID,
                    password: "",
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

    return (
        <Background>
            <UserInfoNav></UserInfoNav>
            <SearchBox placeholder={"검색"}></SearchBox>
            <RoomCreateButton onClick={()=>{onRoomCreateClicked();}}>방 생성</RoomCreateButton>
            <RoomListView>
                {roomList.map(x=><RoomListItem onclick={()=>{
                    setSelectedRoom(x);
                }} roomInfo={x}></RoomListItem>)}
            </RoomListView>
        </Background>
    )
};

export default RoomList;