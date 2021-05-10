import React,{ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import {GetRemoteVideos} from '../../libs/webrtc/callManager';

type Props = {
    srcObject: any | undefined;
};

const VideoPlayer = styled.video`
    display: inline-block;
    width: 33%;
    height: 33%;
`;

export const Video = ({srcObject}: Props) => {
    let videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(!srcObject)
            return;
        if(videoRef.current){
            if(videoRef.current.srcObject != srcObject){
                console.log("set srcObject");
                videoRef.current.srcObject = srcObject;
            }
        }
    });

    return srcObject ? <VideoPlayer ref={videoRef} playsInline={true} autoPlay={true}></VideoPlayer> : <a>사람을 기다려요</a>;
}

export default Video;