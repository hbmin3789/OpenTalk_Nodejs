import React, {ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import RoomInfo,{User} from '../../libs/room/roomInfo';
import UserInfo from '../../libs/user/userInfo';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import UserListView from './UserListView';
import {setVideoEvent, 
        userLeave,
        addUserList,
        getLocalStream, 
        GetRemoteVideos} from '../../libs/webrtc/callManager';
import Video from './Video';
import ChatControl from '../controls/ChatControl';

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
    grid-column: 1;
    grid-row: 1;
    width: 90%;
    height: 90%;
`;

const VideoArea = styled.div`
    width: 100%;
`;

//#endregion

export const RoomDetail = ({room, OnQuitBtnPressed}: Props) => {
    var localVideoRef = React.useRef<HTMLVideoElement>(null);
    var [userList, setUserList] = React.useState<Array<User>>(room.userList);
    var [videoList, setVideoList] = React.useState<Array<MediaStream | undefined>>(new Array<MediaStream | undefined>());

    useEffect(()=>{
        if(localVideoRef.current)
            localVideoRef.current.srcObject = getLocalStream();
    });

    setSocketEvent('userLeave', (resp)=>{
        var newList = userList?.filter(x=>x.userID !== resp.userID);
        setUserList(newList);
        userLeave(resp.userID);
        setVideoList(GetRemoteVideos());
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
        let videos = GetRemoteVideos();
        let newList = new Array<MediaStream|undefined>();
        videos.forEach(x=>newList.push(x));
        if(videos.length < 9){
            for(let i=videoList.length;i<9;i++){
                newList.push(undefined);
            }
        }
        setVideoList(newList);
        
        console.log("RoomDetail videoList : ");
        console.log(videoList);
    });

    return (
        <Background>
            <VideoArea>
                <Header>
                    <RoomNameArea>
                        {room.roomName}
                    </RoomNameArea>
                    <QuitButton onClick={()=>{
                        setVideoList(new Array<MediaStream>());
                        OnQuitBtnPressed();
                        }}>나가기</QuitButton>
                </Header>
                <VideoList>
                    <VideoPlayer ref={localVideoRef} playsInline={true} autoPlay={true} muted={true}></VideoPlayer>
                    {videoList?.map((x,idx)=><Video idx={idx} srcObject={x}></Video>)}
                </VideoList>
            </VideoArea>
            <ChatControl room={room}></ChatControl>
        </Background>
    );
}

export default RoomDetail;