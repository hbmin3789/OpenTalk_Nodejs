import React, {ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import RoomInfo,{User} from '../../libs/room/roomInfo';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import {setVideoEvent, 
        userLeave,
        addUserList,
        getLocalStream, 
        GetRemoteVideos,
        Call} from '../../libs/webrtc/callManager';
import Video from './Video';
import ChatControl from '../controls/ChatControl';
import getUserList from '../../libs/user/userList';

type Props = {
    children: ReactNode;
    room: RoomInfo;
    OnQuitBtnPressed: () => void;
};

//#region styles

const ResponseWidth = 1000;
const MobileWidth = 500;

const Background = styled.div`
  @media screen and (max-width: ${ResponseWidth}px){
    flex-direction: column;
  }
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  display: flex;
`;

const ContentArea = styled.div`
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
`;

const Title = styled.div`  
  @media screen and (max-width: ${ResponseWidth}px){
    font-size: 1rem;
  }
  margin: 2rem;
  font-size: 3rem;
  flex-grow: 1;
`;

const QuitButton = styled.button`
  @media screen and (max-width: ${ResponseWidth}px){
    font-size: 0.8rem;
    margin: 1rem;
  }
  margin: 2rem;
  font-size: 1.5rem;
  height: 3rem;
  background-color: gray;
  color: white;
  border: none;
  cursor: pointer;
  &:focus{
    outline: none;
  }
  &:hover{
    background-color: #555555;
  }
`;

const VideoArea = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
`;

const VideoPlayer = styled.video`
  margin: 1rem 2rem;
  margin-left: 3rem;
  width: 27%;
  height: 27%;
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
            let videos = GetRemoteVideos();
            let stream = videos.get(resp.data.userID);
            let userName = resp.data.userName

            if(stream && userName){
                let videoItem = {
                    stream: stream,
                    userID: resp.data.userID,
                    userName: userName.userName
                };

                setVideoList(old=>[...old, videoItem]);
            }
            var user = resp.data as User;
            room.userList.push(user);
            addUserList(resp.data.userID);
        }
    });

    setVideoEvent(() => {
        console.log('received remote stream');
        let newList = new Array<VideoItem>();
        let videos = GetRemoteVideos();
        let userList = room.userList;
        userList.forEach(u=>{
            let stream = videos.get(u.userID);
            if(stream)
                newList.push({ stream: stream, userName: u.userName, userID: u.userID });
        });
        console.log(videos);
        console.log(userList);
        
        setVideoList(newList);
    });

    return (
        <Background>
            <ContentArea>
                <Header>
                    <Title>
                        {room.roomName}님의방
                    </Title>
                    <QuitButton onClick={()=>{
                        setVideoList(new Array<VideoItem>());
                        OnQuitBtnPressed();
                        }}>나가기</QuitButton>
                </Header>
                <VideoArea>
                <VideoPlayer ref={localVideoRef} playsInline={true} autoPlay={true} muted={true}></VideoPlayer>
                    {videoList?.map((x,idx)=><Video idx={idx} item={x}></Video>)}
                </VideoArea>
            </ContentArea>
            <ChatControl room={room}></ChatControl>
        </Background>
    );
}

export default RoomDetail;