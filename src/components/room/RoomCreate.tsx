import React from 'react';
import styled,{keyframes} from 'styled-components';
import Container from '../../libs/common/container';
import {useHistory} from 'react-router-dom';
import TagInput from '../controls/TagInput';

const Background = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #dddddd;
    overflow: scroll;
`;

const Title = styled.div`
    font-size: 4rem;
    color: black;
    text-align: center;
    margin-top: 3rem;
`;


const CreateArea = styled.div`
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 30rem;
    height: auto;
    padding: 2rem;
    margin-top: 5rem;
    background-color: white;
    border-radius: 10px;
    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
`;

const InputArea = styled.div`
    font-size: 2rem;
`;

const Area = styled.div`
    display: inline-block;
    text-align: center;
    margin-top: 2rem;
    width: 100%;
`;

const Text = styled.div`
    width: 30%;
    display: inline-block;

`;

const Input = styled.input`
    font-size: 2rem;
    width: 50%;
`;

const ButtonArea = styled.div`
    position: relative;
    margin: 2rem;
`;

const CancelButton = styled.button` 
    position: absolute;
`;

const ApplyButton = styled.button`
    position: absolute;
    right: 0;
`;

export const RoomCreate = () => {
    let [roomName, setRoomName] = React.useState<string>("");
    let [password, setPassword] = React.useState<string>("");
    let tagList: string[] = new Array<string>();
    let history = useHistory()

    const onRoomCreateClicked = () => {
        
        var msg = JSON.stringify({
            message: 'createRoom',
            data:{
                userID: Container.curUser.getUserID(),
                roomName: roomName,
                password: password,
                tags: tagList
            }});                     
        Container.socket.send(msg);
        console.log('message To Server' + msg);
        history.push('/');
    }

    return (
        <Background>
            <Title>방을 만들어보세요!</Title>
            <CreateArea>
                <InputArea>
                    <Area>
                        <Text>방 이름</Text>
                        <Input onChange={e=>setRoomName(e.target.value)}></Input>
                    </Area>
                    <Area>
                        <Text>비밀번호</Text>
                        <Input onChange={e=>setPassword(e.target.value)}></Input>
                    </Area>
                    <Area>
                        <TagInput getTagList={(arr)=>{                            
                            console.log(arr);
                            tagList = arr;
                        }}></TagInput>
                    </Area>
                    <ButtonArea>
                        <CancelButton onClick={()=>history.push('/')}>취소</CancelButton>
                        <ApplyButton onClick={onRoomCreateClicked}>생성</ApplyButton>
                    </ButtonArea>
                </InputArea>
            </CreateArea>
        </Background>
    );
};

export default RoomCreate;