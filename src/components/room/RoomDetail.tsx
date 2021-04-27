import React, {ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import RoomInfo,{User} from '../../libs/room/roomInfo';
import UserInfo from '../../libs/user/userInfo';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import UserListView from './UserListView';

type Props = {
    children: ReactNode;
    room: RoomInfo;
    OnQuitBtnPressed: () => void;
};

const RoomDetailBackground = styled.div`{

}`;

const RoomTitle = styled.a`{
    font-family: opentalk-light;
    font-size: 4rem;
}`;

const ChatTextBlock = styled.a`{

}`;

const ChatInput = styled.input`{

}`;

const QuitButton = styled.button`{
    position: absolute;
    right: 3%;
    top: 2%;
}`;

export const RoomDetail = ({room, OnQuitBtnPressed}: Props) => {

    var [userList, setUserList] = React.useState<Array<User>>(room.userList);

    setSocketEvent('userLeave', (resp)=>{
        var newList = userList?.filter(x=>x.userID !== resp.userID);
        setUserList(newList);
    });

    setSocketEvent('userEnter', (resp)=>{
        if(resp.data.userID !== Container.curUser.getUserID()){
            var user = resp.data as User;
            room.userList.push(user);
        }
    });

    useEffect(()=>{
        console.log('effect');
        
        setUserList(room.userList);
    });

    return (
        <RoomDetailBackground>
            <RoomTitle>{room.roomName}</RoomTitle>
            <UserListView userList={userList}>
            </UserListView>
            <ChatTextBlock>
            </ChatTextBlock>
            <ChatInput></ChatInput>
            <QuitButton onClick={()=>OnQuitBtnPressed()}>나가기</QuitButton>
        </RoomDetailBackground>
    );
}

export default RoomDetail;