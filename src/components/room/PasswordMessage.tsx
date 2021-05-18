import React from 'react';
import styled from 'styled-components';
import RoomInfo from '../../libs/room/roomInfo';


type Props = {
    display: boolean;
    cancel: () => void;
    confirm: (room: RoomInfo, password: string) => void;
    room: RoomInfo;
};

//#region 

const Background = styled.div`
    position: fixed;
    background-color: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
`;

const PasswordMessageBackground = styled.div`
    position: absolute;
    width: 30rem;
    height: 10rem;
    font-size: 2rem;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    border-radius: 10px;
`;

const Area = styled.div`
    margin-top: 2.5rem;
    width: 100%;
`;

const CloseButton = styled.button`
    position: absolute;
    font-size: 1rem;
    left: 1rem;
    bottom: 1rem;
`;

const ApplyButton = styled.button`
    position: absolute;
    font-size: 1rem;
    right: 1rem;
    bottom: 1rem;
`;

const PasswordBox = styled.input`
    display: inline-block;
    font-size: 1.5rem;
    margin-left: 1rem;
`;

const Message = styled.a`
    display: inline-block;
    font-size: 1.5rem;
`;

//#endregion

export const PasswordMessage = ({cancel, confirm, display, room}: Props) => {
    let [password, setPassword] = React.useState<string>("");
    return (
        <div>
            {display ? 
        <Background>
            <PasswordMessageBackground>
                <Area>
                    <Message>
                        비밀번호
                    </Message>
                    <PasswordBox onChange={(e)=>setPassword(e.target.value)}>
                    </PasswordBox>
                </Area>
                
                <CloseButton onClick={()=>{
                    cancel();
                }}>
                    닫기
                </CloseButton>
                <ApplyButton onClick={()=>confirm(room, password)}>
                    확인
                </ApplyButton>
            </PasswordMessageBackground>
        </Background>    
        : <div></div>
        }
        

        </div>
        
    );
}

export default PasswordMessage;