import React, { useEffect } from 'react';
import styled from 'styled-components';
import SignIn from './account/SignIn';
import RoomList from './room/RoomList';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Container from '../libs/common/container';
import RoomCreate from './room/RoomCreate';

export const Main = () => {

    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={RoomList} />
                <Route path="/SignIn" render={() => <SignIn isMobile={false}></SignIn>} />
                <Route path="/CreateRoom" component={RoomCreate}></Route>
            </Switch>
        </BrowserRouter>
    );
};

export default Main;