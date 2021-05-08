import React from 'react';
import styled,{keyframes} from 'styled-components';

const NavigationExpandAnimation = keyframes`
    100%{width: 25rem;}
`;

const NavigationCollapseAnimation = keyframes`
    0%{width:25rem};
    100%{width:4rem};
`;

const NavigationBar = styled.div`
    position: fixed;
    height: 100%;
    width: 4rem;
    left: 0%;
    top: 0%;
    background-color: #333333;
    animation-duration: 0.2s;
    animation-name: ${NavigationCollapseAnimation};
    &:hover {
        animation-fill-mode: forwards;
        animation-duration: 0.2s;
        animation-name: ${NavigationExpandAnimation};
    }
`;

export const UserInfoNav = () => {
    return (
        <NavigationBar></NavigationBar>
    );
}

export default UserInfoNav;