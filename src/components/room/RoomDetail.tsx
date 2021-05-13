import React, {ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import RoomInfo,{User} from '../../libs/room/roomInfo';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import {setVideoEvent, 
        userLeave,
        addUserList,
        getLocalStream, 
        GetRemoteVideos} from '../../libs/webrtc/callManager';
import Video from './Video';
import ChatControl from '../controls/ChatControl';
import getUserList from '../../libs/user/userList';

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
    display: flex;
    flex-direction: row;
`;

const RoomNameArea = styled.div`
    display: inline;
    margin: 2rem;
    font-size: 3rem;
    color: white;
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`;

const VideoList = styled.div`
    display: grid;
    margin: 5rem;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
`;

const QuitButton = styled.button`
    font-size: 2rem;
    display: inline;
    margin: 2rem;
    &:focus{
        outline: none;
    }
`;

const VideoPlayer = styled.video`
    width: 100%;
    height: 100%;
`;

const VideoArea = styled.div`
    width: 100%;
`;

type VideoItem = {
    stream: MediaStream;
    userName: string;
    userID: string;
};

const MyVideoArea = styled.div`
    grid-column: 1;
    grid-row: 1;
    padding: 1rem;
`;

//#endregion

export const RoomDetail = ({room, OnQuitBtnPressed}: Props) => {
    var localVideoRef = React.useRef<HTMLVideoElement>(null);
    var [userList, setUserList] = React.useState<Array<User>>(room.userList);
    var [videoList, setVideoList] = React.useState<Array<VideoItem>>(new Array<VideoItem>());

    useEffect(()=>{
        if(localVideoRef.current)
            localVideoRef.current.srcObject = getLocalStream();
    });

    setSocketEvent('userLeave', (resp)=>{
        var newList = videoList?.filter(x=>x.userID !== resp.userID);
        setVideoList(newList);
        userLeave(resp.userID);
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
        let newList = new Array<VideoItem>();
        let videos = GetRemoteVideos();
        let userList = getUserList();
        userList.forEach(u=>{
            let stream = videos.get(u.userID);
            if(stream)
                newList.push({ stream: stream, userName: u.userName, userID: u.userID });
        });
        
        setVideoList(newList);
    });

    return (
        <Background>
            <VideoArea>
                <Header>
                    <RoomNameArea>
                        {room.roomName}
                    </RoomNameArea>
                    <QuitButton onClick={()=>{
                        setVideoList(new Array<VideoItem>());
                        OnQuitBtnPressed();
                        }}>나가기</QuitButton>
                </Header>
                <VideoList>
                    <MyVideoArea>
                        <VideoPlayer ref={localVideoRef} playsInline={true} autoPlay={true} muted={true}></VideoPlayer>
                    </MyVideoArea>
                    {videoList?.map((x,idx)=><Video idx={idx} item={x}></Video>)}
                </VideoList>
            </VideoArea>
            <ChatControl room={room}></ChatControl>
        </Background>
    );
}

export default RoomDetail;