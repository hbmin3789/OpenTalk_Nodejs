// import React from 'react';
// import Main from './components/Main';
// import Font from './fonts/font';


// export const App = () => {

  

//   return (
//     <div>
//       <Font></Font>
//       <Main></Main>
//     </div>
//   )
// }

// export default App;

import React from 'react';
import Main from './components/Main';
import Font from './fonts/font';
import {start, call, hangup, SetVideos} from './libs/webrtc/test';



export const App = () => {
  var localVideoRef = React.useRef<HTMLVideoElement>(null);
  var remoteVideoRef = React.useRef<HTMLVideoElement>(null);


  React.useEffect(()=>{
    if(localVideoRef && remoteVideoRef)
      if(localVideoRef.current && remoteVideoRef.current)
        SetVideos(localVideoRef.current,remoteVideoRef.current);
  });
    
  return (
    <div>
        <video ref={localVideoRef} playsInline={true} autoPlay={true} muted={true}></video>
        <video ref={remoteVideoRef} playsInline={true} autoPlay={true}></video>

        <div>
            <button onClick={()=>{
              start();
            }}>Start</button>
            <button onClick={()=>{
              call();
            }}>Call</button>
            <button onClick={()=>{
              hangup();
            }}>Hang Up</button>
        </div>
    </div>
  )
}
export default App;