import React,{ReactNode, useEffect} from 'react';
import styled from 'styled-components';
import {GetRemoteVideos} from '../../libs/webrtc/callManager';

type Props = {
    srcObject: any | undefined;
    idx: number;
};

const VideoPlayer = styled.video`
`;

export const Video = ({srcObject, idx}: Props) => {
    let videoRef = React.useRef<HTMLVideoElement>(null);
    idx += 1;
    const VideoFrame = styled.div`
        grid-column: ${(idx % 3)+1};
        grid-row: ${Math.floor(idx / 3)+1};
    `;

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

    return srcObject ? <VideoFrame><VideoPlayer ref={videoRef} playsInline={true} autoPlay={true}></VideoPlayer></VideoFrame> : <a>사람을 기다려요</a>;
}

export default Video;