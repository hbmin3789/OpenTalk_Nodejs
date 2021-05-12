import React from 'react';
import Main from './components/Main';
import Font from './fonts/font';
import {InitCallManager} from './libs/webrtc/callManager';
import {InitGetUser} from './libs/user/userList';
export const App = () => {
  InitCallManager();
  InitGetUser();
  return (
    <div>
      <Font></Font>
      <Main></Main>
    </div>
  )
}

export default App;