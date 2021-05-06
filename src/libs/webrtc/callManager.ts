import { Media } from 'reactstrap';
import Container from '../common/container';
import {setSocketEvent} from '../network/websocketEvents';
import { User } from '../room/roomInfo';

let videoList: HTMLDivElement;

let localVideo: HTMLVideoElement;
let localStream: MediaStream;

let peers : { [name: string]: RTCPeerConnection } = {};
let videos: any[] = [];
let localPC: RTCPeerConnection;

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


export const requestConnection = () => {
    Container.socket.send(JSON.stringify({

    }));
};

export const InitCallManager = async (lVideo: HTMLVideoElement) => {
    localVideo = lVideo;
    console.log(localVideo);
    localPC = new RTCPeerConnection();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

        localVideo.srcObject = stream;
        localStream = stream;

        localStream.getTracks().forEach(s=>localPC.addTrack(s, localStream));

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

    setSocketEvent('offer', async (data: any) => {
        let pc = peers[data.userID];
        await pc.setRemoteDescription(data.offer);
        console.log("setDescription : remote");

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("setDescription : local");

        Container.socket.send(JSON.stringify({
            message: "answer",
            answer: answer,
            answerUserID: Container.curUser.getUserID(),
            offerUserID: data.UserID
        }));
    });

    setSocketEvent('answer', async (data: any) => {
        let pc = peers[data.userID];
        await pc.setRemoteDescription(data.answer);
        console.log("setDescription : remote");
    });

    setSocketEvent('icecandidate', (data: any) => {
        let pc = peers[data.userID];
        pc.addIceCandidate(data.icecandidate);
    });
};

const addIceCandidatePC = (pc: RTCPeerConnection) => {
    pc.addEventListener('icecandidate', event => {
        if (event.candidate) {
            Container.socket.send(JSON.stringify({
                message: 'icecandidate',
                icecandidate: event.candidate,
                userID: Container.curUser.getUserID()
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

export const Hangup = (userList: Array<User>) => {
    userList.forEach(x=>{
        try{
            peers[x.userID].close();
        }catch{

        }
    });
};

export function CallAllMember(userList: Array<User>) {
    userList.forEach(x=>Call(x.userID));
}

export const OnUserEnter = (userID: string) => {
    peers[userID] = new RTCPeerConnection(configuration);
}

export function Call(userID: string) {
    peers[userID].createOffer().then((offer)=>{
        peers[userID].setLocalDescription(offer);
        Container.socket.send(JSON.stringify({
            message: "offer",
            offer: offer,
            userID: Container.curUser.getUserID(),
            reqUserID: userID
        }));
    });
}


export const SetUserList = (userList: Array<User>) => {
    peers = {};
    userList.forEach(x=>{
        addUserList(x.userID);
        localStream.getTracks().forEach(s=>peers[x.userID].addTrack(s, localStream));
    });
}

export const addUserList = (userID: string) => {
    peers[userID] = new RTCPeerConnection(configuration);
    setPeerEventListener(peers[userID]);
}

const setPeerEventListener = (pc: RTCPeerConnection) => {
    addIceCandidatePC(pc);

    pc.addEventListener('iceconnectionstatechange', event => {
        if (pc.connectionState === 'connected') {
            console.log('peer connected');
        }
    });

    pc.ontrack = e => {
        var video = videos.find(x=>x.pc === pc);

        if(video){
            video = {pc: pc, stream: e.streams[0]};
            videos.push(video);

            var newVideo = new HTMLVideoElement();
            newVideo.srcObject = video.stream;
            videoList.appendChild(newVideo);

            console.log('received remote stream');
        } else {
            if(video.stream !== e.streams[0]){
                video.stream = e.streams[0];
            }
        }
    };
}

export const SetVideoList = (videoListRef: HTMLDivElement) => {
    videoList = videoListRef;
};