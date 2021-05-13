import React from 'react';
import styled,{keyframes} from 'styled-components';
import Container from '../../libs/common/container';
import {useHistory} from 'react-router-dom';
import TagInput from '../controls/TagInput';
import InputBox from '../controls/InputBox';
//#region styles
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
    transition: 0.3s;
    width: 20rem;
    height: auto;
    padding: 2rem;
    padding-top: 1rem;
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

const ButtonArea = styled.div`
    position: relative;
    text-align: right;
    margin: 1rem;
    margin-top: 2rem;
    margin-bottom: 5rem;
`;

const CancelButton = styled.button` 
    position: absolute;
    background-color: #666666;
    color: #dddddd;
    cursor: pointer;
    border: none;
    left: 0;
    width: 40%;
    border-radius: 3px;
    font-size: 1.5rem;
    &:hover{
        box-shadow: 1px 1px 1px black;
        outline: none;
    }
`;

const ApplyButton = styled.button`
    position: absolute;
    background-color: #666666;
    color: #dddddd;
    right: 0;
    cursor: pointer;
    width: 40%;
    border-radius: 3px;
    font-size: 1.5rem;
    border: none;
    &:hover{
        box-shadow: 1px 1px 1px black;
        outline: none;
    }
`;

const Description = styled.div`
    font-size: 0.6rem;
    color: gray;
    margin-top: 0.7rem;
    margin-left: auto;
    margin-right: 0;
    margin-bottom: 2rem;
`;

//#endregion

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
            <CreateArea>
                <InputArea>
                    <Area>
                        <InputBox onChange={e=>{
                        if(e.target.value.length >= 11){
                            e.target.value = e.target.value.slice(0,10);
                        }
                        setRoomName(e.target.value);
                        }}>방이름</InputBox>
                    </Area>
                    <Description>
                        2자~12자
                    </Description>
                    <Area>
                        <InputBox onChange={e=>{
                            if(e.target.value.length >= 13){
                                e.target.value = e.target.value.slice(0,12);
                            }
                            setPassword(e.target.value)
                            }}>비밀번호</InputBox>
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