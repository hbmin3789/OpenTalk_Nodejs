import React,{ReactNode} from 'react';
import styled, { keyframes } from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';
import { setSocketEvent } from '../../libs/network/websocketEvents';
import Container from '../../libs/common/container';
import TagItem from '../controls/TagItem';

type Props = {
    children?: ReactNode;
    roomInfo: RoomInfo;
    onclick: () => void;
};

const ListViewItemMouseOverColorAnimation = keyframes`
    0%{}
    100%{}
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

const TagList = styled.div`
    display: inline-block;
    text-align: center;
    margin-top: 2rem;
    overflow: hidden;
    font-size: 1rem;
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

    //209 ~ 255 사이의 색을 배경으로 지정
    let R = 209 + (Math.random() * 100 % 46);
    let G = 209 + (Math.random() * 100 % 46);
    let B = 209 + (Math.random() * 100 % 46);

    
    const Background = styled.div`
    margin: 0.4rem;
    display: inline-block;
    background-color: rgb(${R},${G},${B});
    margin-top: 5px;
    padding: 10px;
    height: 18rem;
    width: 14rem;
    cursor: pointer;
    text-align: justify;
    overflow: hidden;
    &:hover{
        transition-property: transform, box-shadow;
        transition-duration: 0.1s;
        transform: translate(0.5rem,-0.5rem);
        box-shadow: -0.5rem 0.5rem 1px #aaaaaa;
    }
`;


    return (
        <Background onClick={() => {onclick();}}>
            <CardBackground>
                <Title>{roomInfo.roomName}</Title>
                <Title>{adminName}님의 방</Title>
                <UserCount>유저{roomInfo.userList.length}명</UserCount>
                <TagList>
                    {roomInfo.tags.map(x=><TagItem deleteBtnVisible={false} 
                                                   children={x}></TagItem>)}
                </TagList>
            </CardBackground>
        </Background>
    );
}

export default RoomListItem;