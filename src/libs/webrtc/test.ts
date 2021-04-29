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
  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  pc1 = new RTCPeerConnection(configuration);
  pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));

  pc2 = new RTCPeerConnection(configuration);
  pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
  pc2.addEventListener('track', gotRemoteStream);

  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

  try {
    //Create Offer -> 통화 시작
    const offer = await pc1.createOffer({offerToReceiveAudio: true,offerToReceiveVideo: true});
    //setRemoteDescription -> Description이 상대방 캠 스트림같은거인듯?
    //이걸 해주면 그때부터 스트리밍이 가능한데 어떻게 하는지는 더 봐야함
    //var offer = pc.createOffer를 Caller가 보내고, setLocalDescription으로 자신의 스트림 설정
    //var answer = pc1.createAnswer를 Callee가 Caller에게 보내고 offer를 setRemoteDescription으로 설정
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