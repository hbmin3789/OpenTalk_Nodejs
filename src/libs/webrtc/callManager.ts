import { Media } from 'reactstrap';
import Container from '../common/container';
import {setSocketEvent} from '../network/websocketEvents';
import { User } from '../room/roomInfo';

let OnRemoteVideoAdded: () =>  void;
let OnRemoteVideoRemoved: () => void;

let localStream: MediaStream;
let peers = new Map<string, RTCPeerConnection>();
let videos: any[] = [];
let localPC: RTCPeerConnection;
let videoList = [];

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
const offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

export const requestConnection = () => {
    Container.socket.send(JSON.stringify({

    }));
};

export const InitCallManager = async () => {
    localPC = new RTCPeerConnection();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

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
        localStream = stream;
    }    

    setSocketEvent('offer', async (data: any) => {
        console.log("peer : ");
        console.log(peers);
        console.log("data : ");
        console.log(data);
        
        let pc = peers.get(data.caller);
        if(pc){
            await pc.setRemoteDescription(data.offer);
            console.log("setDescription : remote");

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log("setDescription : local");

            let ans = JSON.stringify({
                message: "answer",
                answer: answer,
                callee: Container.curUser.getUserID(),
                caller: data.caller
            });
            console.log("answer : " + ans);
            
            Container.socket.send(ans);
        }else{
            console.log("Offer Create Error : peer undefined");
        }
    });

    setSocketEvent('answer', async (data: any) => {
        let pc = peers.get(data.callee);
        if(pc){
            await pc.setRemoteDescription(data.answer);
            console.log("setDescription : remote");   
        } else {
            console.log("Answer Set Error : peer undefined");
        }
    });

    setSocketEvent('icecandidate', (data: any) => {
        let pc = peers.get(data.sender);
        if(pc){
            pc.addIceCandidate(data.icecandidate);
        } else {
            console.log("Icecandidate Event Error : peer undefined");
        }
    });
};

const addIceCandidatePC = (userID: string, pc: RTCPeerConnection) => {
    pc.addEventListener('icecandidate', event => {
        if (event.candidate) {
            Container.socket.send(JSON.stringify({
                message: 'icecandidate',
                icecandidate: event.candidate,
                receiver: userID,
                sender: Container.curUser.getUserID()
            }));
        }
    });
}

export const Hangup = (userList: Array<User>) => {
    userList.forEach(x=>{
        try{
            peers.get(x.userID)?.close();
        }catch{

        }
    });
};

export const OnUserEnter = (userID: string) => {
    peers.set(userID , new RTCPeerConnection(configuration));
}

export async function Call(userID: string) {
    console.log("offer to :" + userID);

    let pc = peers.get(userID);
    if(pc) {
        
        let offer = await pc.createOffer(offerOptions);
        if(pc){
            await pc.setLocalDescription(offer);
            Container.socket.send(JSON.stringify({
                message: "offer",
                offer: offer,
                callee: userID,
                caller: Container.curUser.getUserID()
            }));
        }else{
            console.log("Call Error : peer undefined");
            return;
        }
    } else {
        console.log("Call Error : peer undefined");
    }
}

export const addUserList = (userID: string) => {
    console.log("peer add : " + userID);
    if(!peers.get(userID)){
        let newPC = new RTCPeerConnection(configuration);
        peers.set(userID, newPC);
        
        setPeerEventListener(userID, newPC);
    }
}

export const getLocalStream = () => {
    return localStream;
}

const setPeerEventListener = (userID: string, pc: RTCPeerConnection) => {
    addIceCandidatePC(userID, pc);

    pc.ontrack = e => {
        var video = videos.find(x=>x.pc === pc);

        if(video){
            video = {pc: pc, stream: e.streams[0]};
            videos.push(video);
            videoList.push(video.stream);

            console.log('received remote stream');
        } else {
            if(video.stream !== e.streams[0]){
                video.stream = e.streams[0];
            }
        }
    };
}