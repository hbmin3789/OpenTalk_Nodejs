import React from 'react';
import Main from './components/Main';
import Font from './fonts/font';
import {InitCallManager} from './libs/webrtc/callManager';
export const App = () => {
  InitCallManager();
  return (
    <div>
      <Font></Font>
      <Main></Main>
    </div>
  )
}

export default App;