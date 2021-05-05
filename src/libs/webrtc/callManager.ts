import { Media } from 'reactstrap';
import Container from '../common/container';
import {setSocketEvent} from '../network/websocketEvents';

var localVideo: HTMLVideoElement;
var remoteVideo: HTMLVideoElement;

let localStream: MediaStream;
let remoteStream: MediaStream;
let pc: RTCPeerConnection;

export const requestConnection = () => {
    Container.socket.send(JSON.stringify({

    }));
};

export const InitCallManager = async (lVideo: HTMLVideoElement, rVideo: HTMLVideoElement) => {
    localVideo = lVideo;
    remoteVideo = rVideo;
    console.log(localVideo);
    console.log(remoteVideo);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        localVideo.srcObject = stream;
        localStream = stream;
        const videoTracks = localStream.getVideoTracks();
        const audioTracks = localStream.getAudioTracks();
        if (videoTracks.length > 0) {
            console.log(`Using video device: ${videoTracks[0].label}`);
        }
        if (audioTracks.length > 0) {
            console.log(`Using audio device: ${audioTracks[0].label}`);
        }
    } catch (e) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: { exact: "environment" } } });
        localVideo.srcObject = stream;
        localStream = stream;
    }

    const configuration = {
        'iceServers': [
            {urls:'stun:stun01.sipphone.com'},
            {urls:'stun:stun.ekiga.net'},
            {urls:'stun:stun.fwdnet.net'},
            {urls:'stun:stun.ideasip.com'},
            {urls:'stun:stun.iptel.org'},
            {urls:'stun:stun.rixtelecom.se'},
            {urls:'stun:stun.schlund.de'},
            {urls:'stun:stun.l.google.com:19302'},
            {urls:'stun:stun1.l.google.com:19302'},
            {urls:'stun:stun2.l.google.com:19302'},
            {urls:'stun:stun3.l.google.com:19302'},
            {urls:'stun:stun4.l.google.com:19302'},
            {urls:'stun:stunserver.org'},
            {urls:'stun:stun.softjoys.com'},
            {urls:'stun:stun.voiparound.com'},
            {urls:'stun:stun.voipbuster.com'},
            {urls:'stun:stun.voipstunt.com'},
            {urls:'stun:stun.voxgratia.org'},
            {urls:'stun:stun.xten.com'},
            {
                urls: 'turn:numb.viagenie.ca',
                credential: 'als0511als!',
                username: 'hbmin3789@gmail.com'
            }]
      };

    pc = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(x=>pc.addTrack(x, localStream));
    addIceCandidatePC(pc);

    pc.ontrack = e => {
        if (remoteVideo.srcObject !== e.streams[0]) {
            remoteVideo.srcObject = e.streams[0];
            console.log('received remote stream');
        }
    };

    pc.addEventListener('iceconnectionstatechange', event => {
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
                message: 'icecandidate',
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

export const Hangup = () => {
    pc.close();
};

export const Call = () => {
    createOffer();
};