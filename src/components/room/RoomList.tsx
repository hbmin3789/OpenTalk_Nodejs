import React from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import stringResources from '../../assets/stringResources';
import RoomInfo from '../../libs/room/roomInfo';
import axios from 'axios';
import Container, { container } from '../../libs/common/container';
import User, { UserInfo } from '../../libs/user/userInfo';
import { SetOnGetRoomListEvent, 
    SetOnRoomCreate, SetOnRoomEnterEvent} from '../../libs/network/websocketEvents';
import {useHistory} from 'react-router-dom';
import {RequestRoomList} from '../../libs/network/webSocket';
import RoomDetail from './RoomDetail';

const Background = styled.div`{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
}`;

const RoomListNavigation = styled.div`{
    height: 100%;
    background-color: #dddddd;
    width: 25%;
}`;

const Title = styled.a`{
    display: block;
    text-align: center;
    font-size: 4rem;
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

let loaded;

export const RoomList = () => {
    var cookie = new Cookies();
    var [selectedRoom, setSelectedRoom] = React.useState<RoomInfo>();
    var [roomList, setRoomList] = React.useState<Array<RoomInfo>>(new Array<RoomInfo>());

    SetOnGetRoomListEvent((data: any) => {
        setRoomList(data.roomList);
    });

    SetOnRoomCreate((data: any) => {
        Container.curRoomID = data.data.curRoomID;
        console.log("************Room Created*************");
        console.log(data.data);
        onRoomClicked(data.data);
    });

    SetOnRoomEnterEvent((data: any) => {
        setSelectedRoom(data.data);
        console.log("room enter");
        console.log(data.data);
    });

    var history = useHistory();

    window.addEventListener('load',()=>{
        RequestRoomList();
    });

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
        Container.socket.send(JSON.stringify({
            message: "enterRoom",
            data: {
                roomID: room.roomID,
                password: "",
                userID: Container.curUser.getUserID(),
            }
        }));
    }

    return (
        <Background>
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
            </RoomListNavigation>
            {(selectedRoom) ? 
            <RoomDetail room={selectedRoom}>

            </RoomDetail> : <div></div>}
        </Background>
    )
};

export default RoomList;