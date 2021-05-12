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
    width: 20rem;
    top: 0%;
    background-color: #333333;
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
    background-color: transparent;
    border-left-width: 0;
    border-right-width: 0;
    border-color: #666666;
    border-style: solid;
    color: #dddddd;
    cursor: pointer;
    margin-top: 2rem;

    &:focus{
        outline: none;
    }
`;

const UserNameText = styled.div`
    font-size: 2rem;
    margin-top: 1rem;
    color: white;
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