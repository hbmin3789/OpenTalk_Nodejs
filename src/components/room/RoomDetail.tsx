import React, {ReactNode} from 'react';
import styled from 'styled-components';
import RoomInfo,{User} from '../../libs/room/roomInfo';
import UserInfo from '../../libs/user/userInfo';
import Container from '../../libs/common/container';

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

const UserListView = styled.ul`{

}`;

const ChatTextBlock = styled.a`{

}`;

const ChatInput = styled.input`{

}`;

const QuitButton = styled.button`{

}`;

export const RoomDetail = ({room, OnQuitBtnPressed}: Props) => {

    var [userList, setUserList] = React.useState<Array<User>>();

    return (
        <RoomDetailBackground>
            <RoomTitle>{room.roomName}</RoomTitle>
            <UserListView>
                {room.userList.map(x=>x.userName)}
            </UserListView>
            <ChatTextBlock>
            </ChatTextBlock>
            <ChatInput></ChatInput>
            <QuitButton onClick={()=>OnQuitBtnPressed()}></QuitButton>
        </RoomDetailBackground>
    );
}

export default RoomDetail;