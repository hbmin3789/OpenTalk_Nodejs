import React, {ReactNode} from 'react';
import styled from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';

type Props = {
    children: ReactNode;
    room: RoomInfo;
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

}`

const ChatInput = styled.input`{

}`

export const RoomDetail = ({room}: Props) => {
    return (
        <RoomDetailBackground>
            <RoomTitle>{room.roomName}</RoomTitle>
            <UserListView>
                {room.userList}
            </UserListView>
            <ChatTextBlock>
            </ChatTextBlock>
            <ChatInput></ChatInput>
        </RoomDetailBackground>
    );
}

export default RoomDetail;