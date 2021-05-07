import React, {ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import RoomInfo,{User} from '../../libs/room/roomInfo';
import UserInfo from '../../libs/user/userInfo';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import UserListView from './UserListView';
import {setVideoEvent, GetRemoteVideos, addUserList, getLocalStream, Call} from '../../libs/webrtc/callManager';
import Video from './Video';

type Props = {
    children: ReactNode;
    room: RoomInfo;
    OnQuitBtnPressed: () => void;
};

const RoomDetailBackground = styled.div`{

}`;

const RoomTitle = styled.a`{
    font-family: opentalk-light;
    font-size: 4rem;
}`;

const ChatTextBlock = styled.a`{

}`;

const ChatInput = styled.input`{

}`;

const QuitButton = styled.button`{
    position: absolute;
    right: 3%;
    top: 2%;
}`;

const VideoList = styled.div`{

}`;

const MyVideo = styled.video`{

}`;

let isSetVideo = false;

export const RoomDetail = ({room, OnQuitBtnPressed}: Props) => {
    var localVideoRef = React.useRef<HTMLVideoElement>(null);
    var videoListRef = React.useRef<HTMLDivElement>(null);
    var [videoList, setVideoList] = React.useState<MediaStream[]>();
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
        setVideoList(GetRemoteVideos());
        console.log("RoomDetail videoList : ");
        console.log(videoList);
    });

    console.log("render");

    return (
        <RoomDetailBackground>
            <RoomTitle>{room.roomName}</RoomTitle>
            <div>
                {userList.map(x=>x.userName)}
            </div>
            <MyVideo ref={localVideoRef} playsInline={true} autoPlay={true} muted={true}></MyVideo>
            {videoList ? videoList.map(x=><Video srcObject={x}></Video>) : <div></div>}
            <ChatTextBlock>
            </ChatTextBlock>
            <ChatInput></ChatInput>
            <QuitButton onClick={()=>OnQuitBtnPressed()}>나가기</QuitButton>
        </RoomDetailBackground>
    );
}

export default RoomDetail;