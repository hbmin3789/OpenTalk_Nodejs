import React from 'react';
import styled from 'styled-components';


type Props = {
    display: boolean;
    message: string;
    setDisplay: (func: any) => void;
};

const Background = styled.div`
    position: fixed;
    background-color: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
`;

const MessageBoxBackground = styled.div`
    position: absolute;
    width: 30rem;
    height: 10rem;
    font-size: 2rem;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
`;

const Message = styled.a`
    position: absolute;
    width: 100%;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
`;

const CloseButton = styled.button`
    position: absolute;
    font-size: 1rem;
    right: 1rem;
    bottom: 1rem;
`;

export const MessageBox = ({setDisplay, display, message}: Props) => {
    return (
        <div>
            {display ? 
        <Background>
            <MessageBoxBackground>
                <Message>
                    {message}
                </Message>
                <CloseButton onClick={()=>{
                    setDisplay(false);
                }}>
                    닫기
                </CloseButton>
            </MessageBoxBackground>
        </Background>    
        : <div></div>
        }
        

        </div>
        
    );
}

export default MessageBox;