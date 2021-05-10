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
    position: fixed;
    height: 100%;
    width: 25rem;
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
    border-bottom-width: thick;
    border-color: #666666;
    color: #aaaaaa;
    cursor: pointer;
    &:focus{
        outline: none;
    }
`;

const UserNameText = styled.a`
    font-size: 2rem;
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