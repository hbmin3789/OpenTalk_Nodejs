import React,{ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import {GetRemoteVideos} from '../../libs/webrtc/callManager';

type Props = {
    item: any;
    idx: number;
};

const UserName = styled.div`
    display: block;
    text-align: center;
    font-size: 1.5rem;

`;

const VideoPlayer = styled.video`
    width: 100%;
    height: 100%;
`;

export const Video = ({item, idx}: Props) => {
    let videoRef = React.useRef<HTMLVideoElement>(null);
    idx += 1;
    const VideoFrame = styled.div`
    width: 27%;
    height: 27%;
        padding: 1rem;
    `;

    useEffect(() => {
        if(!item)
            return;
        if(videoRef.current){
            if(videoRef.current.srcObject != item.stream){
                console.log("set srcObject");
                console.log(item.stream);
                videoRef.current.srcObject = item.stream;
            }
        }
    });

    return item ? 
    <VideoFrame>
        <VideoPlayer ref={videoRef} playsInline={true} autoPlay={true}></VideoPlayer>
        <UserName>{item.userName}</UserName>
    </VideoFrame> : 
    <a>사람을 기다려요</a>;
}

export default Video;