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
    display: flex;
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
    text-align: right;
    margin: 1rem;
    margin-top: 2rem;
    margin-bottom: 5rem;
`;

const CancelButton = styled.button` 
    position: absolute;
    background-color: #dd7788;
    cursor: pointer;
    border: none;
    left: 0;
    font-size: 1.5rem;
    box-shadow: 1px 1px 2px black;
    &:hover{
        box-shadow: 1px 1px 4px black;
        outline: none;
    }
`;

const ApplyButton = styled.button`
    position: absolute;
    background-color: #7788ff;
    right: 0;
    cursor: pointer;
    box-shadow: 1px 1px 2px black;
    font-size: 1.5rem;
    border: none;
    &:hover{
        box-shadow: 1px 1px 4px black;
        outline: none;
    }
`;

const Description = styled.div`
    font-size: 1rem;
    color: gray;
    width: 70%;
    margin-top: 0.5rem;
    margin-left: auto;
    margin-right: 0;
`;

export const RoomCreate = () => {
    let [roomName, setRoomName] = React.useState<string>("");
    let [password, setPassword] = React.useState<string>("");
    let tagList: string[] = new Array<string>();
    let history = useHistory()

    const onRoomCreateClicked = () => {
        if(roomName.length <= 1){
            alert("방 이름 규칙을 지켜주세요.");
            return;
        }
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
                        <Input onChange={e=>{
                            if(e.target.value.length >= 11){
                                e.target.value = e.target.value.slice(0,10);
                            }
                            setRoomName(e.target.value)
                        }}></Input>
                    </Area>
                    <Description>
                        2자~12자
                    </Description>
                    <Area>
                        <Text>비밀번호</Text>
                        <Input onChange={e=>{
                            if(e.target.value.length >= 13){
                                e.target.value = e.target.value.slice(0,12);
                            }
                            setPassword(e.target.value)
                            }}></Input>
                    </Area>
                    <Description>
                        0자~12자 (비워놓으면 공개방)
                    </Description>
                    <Area>
                        <TagInput getTagList={(arr)=>{                            
                            console.log(arr);
                            tagList = arr;
                        }}></TagInput>
                    </Area>
                    <Description>
                        엔터키로도 추가할 수 있습니다.
                    </Description>
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