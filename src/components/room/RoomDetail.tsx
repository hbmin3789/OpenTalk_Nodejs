import React, {ReactNode} from 'react';
import styled from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';
import UserInfo from '../../libs/user/userInfo';

type Props = {
    children: ReactNode;
    room: RoomInfo;
    OnQuitBtnPressed: () => void;
};

class User {
    userName = "";
    isAdmin = false;
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
                {room.userList}
            </UserListView>
            <ChatTextBlock>
            </ChatTextBlock>
            <ChatInput></ChatInput>
            <QuitButton onClick={()=>OnQuitBtnPressed()}></QuitButton>
        </RoomDetailBackground>
    );
}

export default RoomDetail;