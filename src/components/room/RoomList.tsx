import React from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import stringResources from '../../assets/stringResources';
import RoomInfo from '../../libs/room/roomInfo';
import axios from 'axios';
import Container, { container } from '../../libs/common/container';
import User, { UserInfo } from '../../libs/user/userInfo';
import { setSocketEvent } from '../../libs/network/websocketEvents';
import {useHistory} from 'react-router-dom';
import RoomDetail from './RoomDetail';
import {addUserList, Hangup} from '../../libs/webrtc/callManager';

const Background = styled.div`{
    position: absolute;
    width: 100%;
    height: 100%;
    display: inline-flex;
}`;

const RoomListNavigation = styled.div`{
    flex-shrink: 0;
    height: 100%;
    background-color: #dddddd;
    width: 25%;
}`;

const Title = styled.a`{
    display: block;
    text-align: center;
    font-size: 2rem;
    font-family: opentalk-bold;
}`;

const SearchArea = styled.div`{
    margin-top: 5%;
}`;

const SearchBox = styled.input`{
    border-radius: 5px;
    border-color: #aaaaaa;
    font-size: 2rem;
    width: 85%;
    display: inline;    
    &:focus{
        outline: none;
    }
}`;

const SearchButton = styled.button`{
    font-size: 1rem;
    width: 10%;
    height: 100%;
    display: inline;
}`;

const ListView = styled.ul`{
    border-width: 5px;
    list-style-type: none;
    padding: 0;
}`;

const ListViewItem = styled.li`{    
    border-radius: 5px;
    background-color: white;
    padding: 10px;
    margin: 0;
    overflow: hidden;
    margin: 2%;
    user-select: none;

    font-size: 1rem;
    cursor: pointer;
    box-shadow: 2px 2px 1px 1px #aaaaaa;
    &:hover{
        box-shadow: 2px 2px 1px 1px #666666;
    }
    &:active{
        box-shadow: 1px 1px 1px 1px black;
    }
}`;

const CreateRoomButton = styled.button`{
}`;

const EmptyRoom = styled.div`{
    text-align: center;
    align-self: center;
    flex-grow: 1;
    font-family: opentalk-bold;
}`;

let loaded;

export const RoomList = () => {
    var cookie = new Cookies();
    var [selectedRoom, setSelectedRoom] = React.useState<RoomInfo>();
    var [roomList, setRoomList] = React.useState<Array<RoomInfo>>(new Array<RoomInfo>());

    setSocketEvent('roomList',(data: any) => {
        setRoomList(data.roomList);
    });

    setSocketEvent('createRoom', (data: any) => {
        Container.curRoomID = data.data.roomID;
        setSelectedRoom(data.data);
    });

    setSocketEvent('enterRoom', (data: any) => {
        console.log("room enter");

        for(let i in data.data.userList){
            var user = JSON.parse(i);
            addUserList(user.userID);
        }

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
            {(selectedRoom) ? 
            <div></div> : 
            <RoomListNavigation>
                <div>
                    <Title>
                        {cookie.get(stringResources.userNameCookie)}님, 반가워요!
                    </Title>
                    <CreateRoomButton onClick={()=>onRoomCreateClicked()}>
                        방 만들기
                    </CreateRoomButton>
                </div>
                <SearchArea>
                    <SearchBox></SearchBox>
                    <SearchButton>검색</SearchButton>
                </SearchArea>
                <ListView>
                    {(roomList) ? roomList.map(x => 
                    <ListViewItem onClick={()=>onRoomClicked(x)}>
                        {x.roomName}
                    </ListViewItem>) : <div></div>}
                </ListView>
            </RoomListNavigation>}
            {(selectedRoom) ? 
            <RoomDetail room={selectedRoom} 
                        OnQuitBtnPressed={()=>{
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
                        }}>

            </RoomDetail> : <EmptyRoom>방을 만들거나 참여해보세요!</EmptyRoom>}
        </Background>
    )
};

export default RoomList;