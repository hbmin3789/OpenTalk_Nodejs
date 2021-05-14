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

const ListItemBackground = styled.div`
    display: inline-block;
`;

const CardBackground = styled.div`
    width: 20rem;
    height: 15rem;  
    background-color: #ffffff;
    border-width: 1px;
    border-color: #aaaaaa;
    border-radius: 5px;
    border-style: solid;
    overflow: hidden;
`;

const TagList = styled.div`
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
    margin-top: 6rem;
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