import React,{ReactNode} from 'react';
import styled, { keyframes } from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';
import { setSocketEvent } from '../../libs/network/websocketEvents';
import Container from '../../libs/common/container';
type Props = {
    children?: ReactNode;
    roomInfo: RoomInfo;
    onclick: () => void;
};

const ListViewItemMouseOverColorAnimation = keyframes`
    0%{}
    100%{}
`;

const Background = styled.div`
    margin: 1rem;
    display: inline-block;
    background-color: white;
    border-radius: 3px;
    margin-top: 5px;
    padding: 10px;
    height: 20rem;
    width: 15rem;
    cursor: pointer;
    text-align: justify;
    &:hover{
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
`;

const Title = styled.a`
    display: block;
    font-size: 1.5rem;
`;

const UserCount = styled.a`
    height: 100%;
    display: block;
    font-size: 1.5rem;
    text-align: right;
`;

const CardBackground = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
`;

export const RoomListItem  = ({roomInfo, onclick}: Props) => {
    let [adminName,setAdminName] = React.useState<string>("");

    setSocketEvent('userName',(data)=>{
        setAdminName(data.userName);
    });

    Container.socket.send(JSON.stringify({
        message: "userName",
        userID: roomInfo.adminID,
    }));



    return (
        <Background onClick={() => {onclick();}}>
            <CardBackground>
                <Title>{roomInfo.roomName}</Title>
                <Title>{adminName}님의 방</Title>
                <UserCount>유저{roomInfo.userList.length}/9명</UserCount>
                {roomInfo.tags.map(x=><div>{x}</div>)}
            </CardBackground>
        </Background>
    );
}

export default RoomListItem;