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
    overflow: hidden;
    &:hover{
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
`;

const Title = styled.a`
    display: block;
    font-size: 1.5rem;
    margin-top: 0.5rem;
`;

const UserCount = styled.a`
    height: 100%;
    display: block;
    font-size: 1.5rem;
    text-align: right;
    margin-top: 0.5rem;
`;

const CardBackground = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
`;

const TagHoverBorderColor = "#99dfdf";
const TagBorderColor = "#999999";

const ToggleButtonHoverAnimation = keyframes`
    0%{
        border-color: ${TagBorderColor};
    }
    100%{
        border-color: ${TagHoverBorderColor};
    }
`;
const ToggleButtonHleaveAnimation = keyframes`
    0%{
        border-color: ${TagHoverBorderColor};
    }
    100%{
        border-color: ${TagBorderColor};
    }
`;

const TagItem = styled.div`
    position: relative;
    display: inline-block;
    border-radius: 100px;
    border-style: solid;
    cursor: pointer;
    border-color: ${TagBorderColor};
    background-color: white;
    font-size: 1rem;
    animation-duration: 100ms;
    padding: 2px 0.5rem;
    margin-top: 0.5rem;
    animation-name: ${ToggleButtonHleaveAnimation};
    &:hover{
        animation-duration: 100ms;
        animation-name: ${ToggleButtonHoverAnimation};
        animation-fill-mode: forwards;
    }
`;

const TagList = styled.div`
    display: inline-block;
    text-align: center;
    margin-top: 2rem;
    overflow: hidden;
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
                <TagList>
                    {roomInfo.tags.map(x=><TagItem>#{x}</TagItem>)}
                </TagList>
            </CardBackground>
        </Background>
    );
}

export default RoomListItem;