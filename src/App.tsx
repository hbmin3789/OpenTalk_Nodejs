import React from 'react';
import Main from './components/Main';
import Font from './fonts/font';
import {InitCallManager} from './libs/webrtc/callManager';
import {InitGetUser} from './libs/user/userList';
import GlobalFont from './fonts/font';


export const App = () => {
  InitCallManager();
  InitGetUser();
  return (
    <div>
      <GlobalFont></GlobalFont>
      <Font></Font>
      <Main></Main>
    </div>
  )
}

export default App;