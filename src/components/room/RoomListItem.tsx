import React,{ReactNode} from 'react';
import styled, { keyframes } from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';

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
    return (
        <Background onClick={() => {onclick();}}>
            <CardBackground>
                <Title>{roomInfo.roomName}</Title>
                <UserCount>유저{roomInfo.userList.length}/2명</UserCount>
            </CardBackground>
        </Background>
    );
}

export default RoomListItem;