import React from 'react';
import styled from 'styled-components';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import ChatItem from '../../libs/room/chatItem';
import RoomInfo from '../../libs/room/roomInfo';

type Props = {
    room: RoomInfo;
}

const Background = styled.div`
    right: 0;
    left: auto;
    width: auto;
    background-color: white;
    display: flex;
    align-items: flex-end;
    flex-direction: column-reverse;
`;

const ChatList = styled.div`
    width: 100%;
`;

const Chat = styled.a`
    display: block;
`;

const MyChat = styled.a`
    display: block;
    right: 0;
    background-color: #ee99ee;
`;

const InputArea = styled.div`
    display: flex;
    width: 100%;
`;

const ChatInput = styled.input`
    
`;

const SendChat = styled.button`
    font-size: 1.2rem;
    width: 5rem;
`;

export const ChatControl = ({room}: Props) => {
    let [content, setContent] = React.useState<string>("");
    let [chatList, setChatList] = React.useState<Array<ChatItem>>(new Array<ChatItem>());
    let ChatInputRef = React.useRef<HTMLInputElement>(null);
    const OnSendChat = () => {
        if(content === ""){
            return;
        }
        let chat = new ChatItem();
        chat.content = content; 
        chat.userID = Container.curUser.getUserID();
        chat.userName = Container.curUser.getUserName();
        chat.roomID = room.roomID;

        Container.socket.send(JSON.stringify({
            message: "chat",
            data: chat
        }));

        if(ChatInputRef.current)
            ChatInputRef.current.value = "";
        setContent("");
    }

    window.onkeyup = (e: any)=>{
        if(e.key === "Enter"){
            OnSendChat();
        }
    };

    setSocketEvent('chatItems', (data) => {

    });

    setSocketEvent('chat', (data) => {
        console.log(data);
        setChatList([...chatList, data.data as ChatItem]);
    });

    return (
        <Background>
            <InputArea>
                <ChatInput ref={ChatInputRef} onChange={(e)=>{
                    setContent(e.target.value);
                }}></ChatInput>
                <SendChat onClick={OnSendChat}>보내기</SendChat>
            </InputArea>
            <ChatList>
                {chatList ? chatList.map(x=>
                (x.userID === Container.curUser.getUserID()) ? <MyChat>{x.content}</MyChat> : 
                <Chat>{x.userName} : {x.content}</Chat>) : <div></div>}
            </ChatList>
        </Background>
    );
}

export default ChatControl;