import React,{ReactNode, useEffect} from 'react';
import {GetRemoteVideos} from '../../libs/webrtc/callManager';

type Props = {
    userID: string;
};

export const Video = ({userID}: Props) => {
    let videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        var streams = GetRemoteVideos();
        var stream = streams.get(userID);
        if(videoRef.current && stream){
            videoRef.current.srcObject = stream;
        }
    });

    return (
        <video ref={videoRef} playsInline={true} autoPlay={true}></video>
    )
}

export default Video;