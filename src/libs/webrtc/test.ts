export const a = 0;

var localVideo: HTMLVideoElement;
var remoteVideo: HTMLVideoElement;

let localStream: MediaStream;
let pc1: RTCPeerConnection;
let pc2: RTCPeerConnection;

function getName(pc: RTCPeerConnection) {
  return (pc === pc1) ? 'pc1' : 'pc2';
}

function getOtherPc(pc: RTCPeerConnection) {
  return (pc === pc1) ? pc2 : pc1;
}

async function onCreateOfferSuccess(desc: RTCSessionDescriptionInit) {
  try {
    await pc1.setLocalDescription(desc);
  } catch (e) {
  }

  try {
    await pc2.setRemoteDescription(desc);
  } catch (e) {
  }

  
  try {
    const answer = await pc2.createAnswer();
    await onCreateAnswerSuccess(answer);
  } catch (e) {
    console.log(`Failed to create session description: ${e.toString()}`);
  }
}

function gotRemoteStream(e: RTCTrackEvent) {
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
    console.log('pc2 received remote stream');
  }
}

async function onCreateAnswerSuccess(desc: RTCSessionDescriptionInit) {
  try {
    await pc2.setLocalDescription(desc);
  } catch (e) {
    console.log(`Failed to set session description: ${e.toString()}`);
  }

  try {
    await pc1.setRemoteDescription(desc);
  } catch (e) {
    console.log(`Failed to set session description: ${e.toString()}`);
  }
}

async function onIceCandidate(pc: RTCPeerConnection, event: any) {
  try {
    await (getOtherPc(pc).addIceCandidate(event.candidate));
  } catch (e) {
    console.log(`${getName(pc)} failed to add ICE Candidate: ${e.toString()}`);
  }
}



export async function start() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    localVideo.srcObject = stream;
    localStream = stream;
  } catch (e) {
    alert(`getUserMedia() error: ${e.name}`);
  }
}

export async function call() {
  var myHostname = window.location.hostname;
  const configuration = {
    iceServers: [     // Information about ICE servers - Use your own!
      {
        urls: "turn:" + myHostname,  // A TURN server
        username: "webrtc",
        credential: "turnserver"
      }
    ]
};

  pc1 = new RTCPeerConnection(configuration);
  pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));

  pc2 = new RTCPeerConnection(configuration);
  pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
  pc2.addEventListener('track', gotRemoteStream);

  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

  try {
    //Create Offer -> 통화 시작
    const offer = await pc1.createOffer({offerToReceiveAudio: true,offerToReceiveVideo: true});
    await onCreateOfferSuccess(offer);
  } catch (e) {
    console.log(`Failed to create session description: ${e.toString()}`);
  }
}

export function hangup() {
  pc1.close();
  pc2.close();
}

export const SetVideos = (v1: HTMLVideoElement,v2: HTMLVideoElement) =>{
  localVideo = v1;
  remoteVideo = v2;
}