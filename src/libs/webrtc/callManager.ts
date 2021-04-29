import Container from '../common/container';
import {setSocketEvent} from '../network/websocketEvents';

var localVideo: HTMLVideoElement;
var remoteVideo: HTMLVideoElement;

let localStream: MediaStream;
let pc: RTCPeerConnection;

export const requestConnection = () => {

    Container.socket.send(JSON.stringify({

    }));
};


export const InitCallManager = async (localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        localVideo.srcObject = stream;
        localStream = stream;
    } catch (e) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: { exact: "environment" } } });
        localVideo.srcObject = stream;
        localStream = stream;
    }

    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};

    pc = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(x=>pc.addTrack(x,localStream));
    addIceCandidatePC(pc);

    pc.addEventListener('track',(e: RTCTrackEvent)=>{
        if (remoteVideo.srcObject !== e.streams[0]) {
            remoteVideo.srcObject = e.streams[0];
            console.log('received remote stream');
          }
    });

    pc.addEventListener('connectionstatechange', event => {
        if (pc.connectionState === 'connected') {
            console.log('peer connected');
        }
    });

    setSocketEvent('offer', async (data: any) => {

        await pc.setRemoteDescription(data.offer);
        console.log("setDescription : remote");

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("setDescription : local");

        Container.socket.send(JSON.stringify({
            message: "answer",
            answer: answer,
            userID: Container.curUser.getUserID()
        }));
    });

    setSocketEvent('answer', async (data: any) => {
        await pc.setRemoteDescription(data.answer);
        console.log("setDescription : remote");
    });

    setSocketEvent('icecandidate', (data: any) => {
        pc.addIceCandidate(data.icecandidate);
    });
    
};

const addIceCandidatePC = (pc: RTCPeerConnection) => {
    pc.addEventListener('icecandidate', event => {
        if (event.candidate) {
            Container.socket.send(JSON.stringify({
                messsage: 'icecandidate',
                icecandidate: event.candidate
            }));
        }
    });

    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
    pc.addEventListener('message', async (message: any) => {
        console.log(message);
        var message = JSON.parse(message);
        if (message.iceCandidate) {
            try {
                await pc.addIceCandidate(message.iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });
}

//Offer를 생성하여 상대 클라이언트에게 연결 요청을 보냅니다.
export const createOffer = () => {
    pc.createOffer().then((offer)=>{
        pc.setLocalDescription(offer);
        Container.socket.send(JSON.stringify({
            message: "offer",
            offer: offer,
            userID: Container.curUser.getUserID()
        }));
    });
}

export const Call = () => {
    createOffer();
};