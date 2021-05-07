import React,{ReactNode, useEffect} from 'react';

type Props = {
    srcObject: any;
};

export const Video = ({srcObject}: Props) => {
    let videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoRef.current)
            videoRef.current.srcObject = srcObject;
    });

    return (
        <video ref={videoRef}></video>
    )
}

export default Video;