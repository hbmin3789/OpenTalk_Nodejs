import React, {ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import RoomInfo,{User} from '../../libs/room/roomInfo';
import UserInfo from '../../libs/user/userInfo';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import UserListView from './UserListView';
import {setVideoEvent, addUserList, getLocalStream, Call} from '../../libs/webrtc/callManager';
import Video from './Video';

type Props = {
    children: ReactNode;
    room: RoomInfo;
    OnQuitBtnPressed: () => void;
};

//#region styles

const Background = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #8888ee;
`;

const RoomNameArea = styled.div`
    display: inline;
    margin: 2rem;
`;

const RoomNameTextBox = styled.input`
    font-size: 2rem;
    border: none;
    &:focus{
        outline: none;
    }
`;

const EditRoomNameButton = styled.button`
    font-size: 2rem;
    padding: 0;
    border: none;
    margin: 0;
    margin-left: 1rem;
    cursor: pointer;
    &:focus{
        outline: none;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`;

const VideoList = styled.div`
    display: block;
`;

const QuitButton = styled.button`
    font-size: 2rem;
    display: inline;
    margin: 2rem;
    &:focus{
        outline: none;
    }
`;

//#endregion

let isSetVideo = false;

export const RoomDetail = ({room, OnQuitBtnPressed}: Props) => {
    var localVideoRef = React.useRef<HTMLVideoElement>(null);
    var [userList, setUserList] = React.useState<Array<User>>(room.userList);

    useEffect(()=>{
        if(localVideoRef.current)
            localVideoRef.current.srcObject = getLocalStream();
    });

    setSocketEvent('userLeave', (resp)=>{
        var newList = userList?.filter(x=>x.userID !== resp.userID);
        setUserList(newList);
    });

    setSocketEvent('userEnter', (resp)=>{
        if(resp.data.userID !== Container.curUser.getUserID()){
            setUserList(old=>[...old, resp.data]);
            var user = resp.data as User;
            room.userList.push(user);

            addUserList(resp.data.userID);
        }
        console.log("enter");
    });

    setVideoEvent(() => {
        console.log("RoomDetail : getStream");
        
        setUserList(userList);
    });

    return (
        <Background>
            <Header>
                <RoomNameArea>
                    <RoomNameTextBox></RoomNameTextBox>
                    <EditRoomNameButton>확인</EditRoomNameButton>
                </RoomNameArea>
                <QuitButton onClick={()=>OnQuitBtnPressed()}>나가기</QuitButton>
            </Header>
            <VideoList>
                <video ref={localVideoRef} playsInline={true} autoPlay={true} muted={true}></video>
                {userList ? userList.map(x=><Video userID={x.userID}></Video>) : <div></div>}
            </VideoList>
        </Background>
    );
}

export default RoomDetail;