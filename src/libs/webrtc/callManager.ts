import { Media } from 'reactstrap';
import Container from '../common/container';
import {setSocketEvent} from '../network/websocketEvents';
import { User } from '../room/roomInfo';


let OnRemoteVideoAdded: () => void;
let OnRemoteVideoRemoved: () => void;

export const setVideoEvent = (func: () => void) => {
    OnRemoteVideoAdded = func;
}

let localStream: MediaStream;
let peers = new Map<string, RTCPeerConnection>();
let connectedPeers = new Map<string, RTCPeerConnection>();
let localPC: RTCPeerConnection;
let videoList = new Map<string, MediaStream>();

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

            if(!connectedPeers.get(data.callee)){
                console.log("*****start response*****");
                connectedPeers.set(data.callee, pc);
                //Call(data.callee);
            }
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
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            Container.socket.send(JSON.stringify({
                message: 'icecandidate',
                icecandidate: event.candidate,
                receiver: userID,
                sender: Container.curUser.getUserID()
            }));
        }
    };
}

export const Hangup = (userList: Array<User>) => {
    console.log("hangup");
    userList.forEach(x=>{
        try{
            peers.get(x.userID)?.close();
        }catch{
            console.log(x.userID + "user hang up error");
        }
    })

    try{
        peers = new Map<string, RTCPeerConnection>();
        videoList = new Map<string, MediaStream>();
    }catch{

    }

    console.log("hangup ended");
    
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
        localStream.getTracks().forEach(s=>newPC.addTrack(s, localStream));
        
        setPeerEventListener(userID, newPC);
    } else {

    }
}

export const GetRemoteVideos = () => {
    let retval: MediaStream[] = [];
    videoList.forEach((val,key)=>{

        retval.push(val);
    });  

    console.log("videos : ");
    console.log(retval);
     
    return retval;
}

export const getLocalStream = () => {
    return localStream;
}

const setPeerEventListener = (userID: string, pc: RTCPeerConnection) => {
    addIceCandidatePC(userID, pc);

    pc.addEventListener('message', async (message: any) => {
        console.log(JSON.stringify(message));
        var message = JSON.parse(message);
        if (message.iceCandidate) {
            try {
                await pc.addIceCandidate(message.iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });

    pc.ontrack = e => {
        console.log('received remote stream');
        if(!videoList.get(userID))
            videoList.set(userID, e.streams[0]);
        OnRemoteVideoAdded();
    };
}