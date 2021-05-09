import React,{ReactNode, useEffect} from 'react';
import {GetRemoteVideos} from '../../libs/webrtc/callManager';

type Props = {
    srcObject: any;
};

export const Video = ({srcObject}: Props) => {
    let videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoRef.current){
            if(videoRef.current.srcObject != srcObject){
                console.log("set srcObject");
                videoRef.current.srcObject = srcObject;
            }
        }
    });

    return (
        <video ref={videoRef} playsInline={true} autoPlay={true}></video>
    )
}

export default Video;