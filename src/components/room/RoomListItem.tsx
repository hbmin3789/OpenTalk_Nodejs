import React,{ReactNode} from 'react';
import styled, { keyframes } from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';
import { setSocketEvent } from '../../libs/network/websocketEvents';
import Container from '../../libs/common/container';
import TagItem from '../controls/TagItem';

const ResponseWidth = 1000;
const MobileWidth = 500;

type Props = {
    children?: ReactNode;
    roomInfo: RoomInfo;
    onclick: () => void;
};

const ListItemBackground = styled.div`
    margin: 1rem;
    width: 20%;
    height: 10rem;
    display: inline-block;
`;

const CardBackground = styled.div`
    width: 100%;
    height: 100%;  
    background-color: #ffffff;
    border-width: 1px;
    border-color: #aaaaaa;
    border-radius: 5px;
    border-style: solid;
    overflow: hidden;
`;

const TagList = styled.div`
    position: relative;
    padding: 1rem;
    height: 100%;
`;

const Title = styled.div`
    font-size: 1.5rem;
    margin-top: 0.5rem;
`;

const AdminName = styled.div`
    font-size: 1rem;
`;

const TagEmpty = styled.div`
    font-size: 1rem;
    text-align: center;
    margin-top: 30%;
    transform: translate(0,-50%);
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
        <ListItemBackground onClick={onclick}>
            <CardBackground>
                <TagList>
                {(roomInfo.tags.length < 1) ? <TagEmpty>태그가 없습니다.</TagEmpty> : 
                roomInfo.tags.map(x=><TagItem deleteBtnVisible={false} 
                    children={x}></TagItem>)}
                </TagList>
            </CardBackground>

            <Title>{roomInfo.roomName}</Title>
            <AdminName>{adminName}</AdminName>
        </ListItemBackground>
    );
}

export default RoomListItem;