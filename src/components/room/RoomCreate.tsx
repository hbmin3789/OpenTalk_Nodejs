import React from 'react';
import styled,{keyframes} from 'styled-components';
import Container from '../../libs/common/container';
import {useHistory} from 'react-router-dom';


const CreateArea = styled.div`
    position: absolute;
    box-shadow: 1px 1px 10px black;
    width: 50%;
    height: 70%;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
`;

const InputArea = styled.div`
    position: absolute;
    left: 50%;
    top: 2rem;
    transform: translate(-50%,0);
    font-size: 2rem;
`;

const Area = styled.div`
    display: block;
    text-align: left;
    margin-top: 2rem;
`;

const Input = styled.input`
    font-size: 2rem;
`;

const ButtonArea = styled.div`
    position: absolute;
    width: 100%;
    margin-top: 2rem;
`;

const CancelButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
`;

const ApplyButton = styled.button`
    position: absolute;
    top: 1rem;
    left: 1rem;
`;

export const RoomCreate = () => {
    let [roomName, setRoomName] = React.useState<string>();
    let [password, setPassword] = React.useState<string>();
    let history = useHistory();

    const onRoomCreateClicked = () => {
        var msg = JSON.stringify({
            message: 'createRoom',
            data:{
                userID: Container.curUser.getUserID(),
                roomName: roomName,
                password: password,
                tags: new Array<number>()
            }});                     
        Container.socket.send(msg);
        console.log('message To Server' + msg);
        history.push('/');
    }

    return (
        <CreateArea>
            <InputArea>
                <Area>
                    <a>방 이름</a>
                    <Input onChange={e=>setRoomName(e.target.value)}></Input>
                </Area>
                <Area>
                    <a>비밀번호</a>
                    <Input onChange={e=>setPassword(e.target.value)}></Input>
                </Area>
                <ButtonArea>
                    <CancelButton>취소</CancelButton>
                    <ApplyButton onClick={onRoomCreateClicked}>생성</ApplyButton>
                </ButtonArea>
            </InputArea>
        </CreateArea>
    );
};

export default RoomCreate;