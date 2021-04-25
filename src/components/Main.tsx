import React, { useEffect } from 'react';
import styled from 'styled-components';
import SignIn from './account/SignIn';
import RoomList from './room/RoomList';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


export const Main = () => {

    var [isMobile, setIsMobile] = React.useState<boolean>(false);

    useEffect(() => {
        if(window.innerWidth < 1000){
            setIsMobile(true);
            return;
        }
        setIsMobile(false);
    });

    

    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={RoomList} />
                <Route path="/SignIn" render={() => <SignIn isMobile={isMobile}></SignIn>} />
            </Switch>
        </BrowserRouter>
    );
};

export default Main;