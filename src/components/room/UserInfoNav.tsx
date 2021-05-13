import React from 'react';
import styled,{keyframes} from 'styled-components';
import Container from '../../libs/common/container';

type Props = {
    createButtonClicked: () => void;
}

const NavigationExpandAnimation = keyframes`
    0%{left: -22rem}
    100%{left: 0%;}
`;

const NavigationCollapseAnimation = keyframes`
    0%{left: 0rem};
    100%{left: -22rem};
`;

const NavigationBar = styled.div`
    height: 100%;
    width: 15rem;
    top: 0%;
    background-color: #dddddd;
    animation-duration: 0.2s;
    animation-name: ${NavigationCollapseAnimation};
    animation-fill-mode: forwards;
    &:hover {
        animation-fill-mode: forwards;
        animation-duration: 0.2s;
        animation-name: ${NavigationExpandAnimation};
    }
`;

const CreateRoomButton = styled.button`
    width: 100%;
    font-size: 2rem;
    background-color: #aaaaaa;
    border-left-width: 0;
    border-right-width: 0;
    border-color: #666666;
    border-style: solid;
    color: black;
    cursor: pointer;
    margin-top: 2rem;
    font-family: 'opentalk-mid';
    &:hover{
        background-color: #bbbbbb;   
    }
    &:focus{
        outline: none;
        
    }
`;

const UserNameText = styled.div`
    font-size: 2rem;
    margin-top: 1rem;
    color: black;
    text-align: center;
`;

export const UserInfoNav = ({createButtonClicked}:Props) => {
    return (
        <NavigationBar>
            <UserNameText>{Container.curUser.getUserName()}</UserNameText>
            <CreateRoomButton onClick={createButtonClicked}>방 생성</CreateRoomButton>
        </NavigationBar>
    );
}

export default UserInfoNav;