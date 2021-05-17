import React, {ReactNode} from 'react';
import styled, {keyframes} from 'styled-components';
import VideoCallImage from '../../assets/VideoCallImage.jpg';
import {FontSizes} from '../../assets/GlobalStyle';
import { Cookies } from 'react-cookie';
import stringResources from '../../assets/stringResources';
import {Link, useHistory} from 'react-router-dom';
import Container from '../../libs/common/container';


const ResponseWidth = 1000;

const UserNameArea = styled.div`
    @media screen and (max-width: ${ResponseWidth}px){
        font-size: 0.5rem;
    }
    display: flex;
    margin-top: 4%;
    justify-content: center;
`;

const BackgroundImage = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(10px);
`;

const BlurEffect = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 70%;
    background: #aaaaaa;
`;

const TitleAnimation = keyframes`
    0%{
        opacity: 0%;
        margin-top: 5%;
    }
    100%{
        opacity: 100%;
        margin-top: 0%;
    }
`;

const TitleArea = styled.div`
    left: 50%;
    top: 40%;
    transform: translate(-50%,-50%);
    position: absolute;
    display: block;
    color: white;
    font-family: 'opentalk-bold';
    text-align: center;
    animation: ${TitleAnimation};
    animation-duration: 2s;
`;

const Title = styled.a`
    @media screen and (max-width: ${ResponseWidth}px){
        font-size: 2rem;
    }
    font-size: ${FontSizes.titleFontSize}rem;
`;

const SubTitle = styled.a`
    @media screen and (max-width: ${ResponseWidth}px){
        font-size: 1.5rem;
    }
    font-size: ${FontSizes.subTitleFontSize}rem;
    display:  block;
`;

const UserNameInput = styled.input`
    @media screen and (max-width: ${ResponseWidth}px){
        font-size: 1rem;
        border: 0.5rem solid white;
    }
    border: 1rem solid white;
    border-radius: 10px;
    font-size: ${FontSizes.subTitleFontSize}rem;
    &::placeholder {
        color: #aaaaaa;
    }
    &:focus{
        outline: none;
    }
`;

const ConfirmButton = styled.button`
    @media screen and (max-width: ${ResponseWidth}px){
        width: 5rem;
        font-size: 1rem;
        margin-left: 10px;   
    }
    margin-left: 20px;        
    border-radius: 10px;
    border: 0px;
    font-size: 2rem;
    padding-left: 2%;
    padding-right: 2%;
    background: #525252;
    color: white;
    cursor: pointer;
    &:focus{
        outline: none;
    }
    &:hover{
        background: #323232;
    }
`;

type Props = {
    
    isMobile: boolean;    
};

export const SignIn = ({isMobile}: Props) => {
    const [userName,setUserName] = React.useState<string>("");
    const [confirmEnabled, setConfirmEnabled] = React.useState<boolean>(false);
    const history = useHistory();
    var cookie = new Cookies();

    const onConfirm = () => {
        cookie.set(stringResources.userNameCookie, userName);
        history.push('/');
        Container.socket.send(JSON.stringify({
            message: 'connect',
            userID: cookie.get(stringResources.userIDCookie),
            userName: userName
        }));
    }

    React.useEffect(()=>{
        if(cookie.get(stringResources.userNameCookie)){
            history.push('/');
            return;
        }

        if(userName)
            (userName.length === 0) ? setConfirmEnabled(false) : setConfirmEnabled(true);
    });

    return (
        <div>
            <BackgroundImage src={VideoCallImage}></BackgroundImage>
            <BlurEffect></BlurEffect>
            <TitleArea>
                <Title>말이 통하는 나만의 공간</Title>
                <br></br>
                <SubTitle>
                    학교 동아리, 게임 그룹, 세계 예술 감상 커뮤니티는 물론, 단짝 친구들과도 손쉽게 어울려보세요.
                    <br></br> 
                    OpenTalk을 사용하면 더 쉽게, 매일 어울리고 이야기할 수 있어요.
                </SubTitle>
                <UserNameArea>
                    <UserNameInput placeholder={"닉네임을 입력하세요."} onChange={(e) => {
                        setUserName(e.target.value);
                        if(userName)
                            (e.target.value.length === 0) ? setConfirmEnabled(false) : setConfirmEnabled(true);                                                
                        }}></UserNameInput>
                    <ConfirmButton disabled={!confirmEnabled} onClick={onConfirm}>확인</ConfirmButton>
                </UserNameArea>
            </TitleArea>
            
        </div>
    )
};

export default SignIn;