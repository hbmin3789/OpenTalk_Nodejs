import React from 'react';
import styled from 'styled-components';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import ChatItem from '../../libs/room/chatItem';
import RoomInfo from '../../libs/room/roomInfo';
import sendIcon from '../../assets/send.png';

type Props = {
    room: RoomInfo;
}

const ChatArea = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: 30rem;
  background-color: #ededed;
`;

const ChatList = styled.ul`
  margin: 1rem;
  list-style: none;
  margin-bottom: 0;
  background-color: #ffffff;
  border-radius: 1rem;
  border-width: 1rem;
  border-color: #aaaaaa;
  height: 100%;
  padding: 0;
  overflow: auto;
`;

const ChatInputArea = styled.div`
  display: flex;
`;

const SendButton = styled.button`
  align-self: center;
  width: 3rem;
  height: 3rem;
  border: none;
  cursor: pointer;
  margin: 1rem;
  margin-left: 0;
  padding: 0;
  background-color: #dddddd;
  &:focus{
    outline: none;
  }
  &:hover{
    background-color: #999999;
  }
`;

const SendButtonImage = styled.img`
  width: 100%;
  height: 100%;
`;

const ChatInput = styled.input`
  padding: 1rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 1rem;
  margin: 1rem;
  flex-grow: 1;
  &:focus{
    outline: none;
  }
`;

const Chat = styled.div`
    left: 0;
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background-color: #e3eeff;
    margin: 1rem;
    font-size: 1.5rem;
    border-radius: 1rem 1rem 1rem 0rem;
`;

const MyChat = styled.div`
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: #518ded;
    margin: 1rem;
    font-size: 1.5rem;
    border-radius: 1rem 1rem 0px 1rem;
`;

const MyChatContainer = styled.div`
    text-align: right;
`;

export const ChatControl = ({room}: Props) => {
    let [content, setContent] = React.useState<string>("");
    let [chatList, setChatList] = React.useState<Array<ChatItem>>(new Array<ChatItem>());
    let ChatInputRef = React.useRef<HTMLInputElement>(null);
    let ChatListRef = React.useRef<HTMLUListElement>(null);

    const OnSendChat = () => {
        
        if(content === ""){
            return;
        }
        let chat = new ChatItem();
        chat.content = content; 
        chat.userID = Container.curUser.getUserID();
        chat.userName = Container.curUser.getUserName();
        chat.roomID = room.roomID;

        let data = JSON.stringify({
            message: "chat",
            data: chat
        });

        Container.socket.send(data);

        if(ChatInputRef.current)
            ChatInputRef.current.value = "";
        setContent("");
    }

    window.onkeyup = (e: any)=>{
        if(e.key === "Enter"){
            OnSendChat();
        }
    };

    setSocketEvent('chat', (data) => {
        setChatList([...chatList, data.data as ChatItem]);
        if(ChatListRef.current){            
            ChatListRef.current.scrollTo(0, ChatListRef.current.scrollHeight);
        }
    });

    return (
        <ChatArea>
            <ChatInputArea>
                <ChatInput ref={ChatInputRef} onChange={(e)=>{
                    setContent(e.target.value);
                }}></ChatInput>
                <SendButton onClick={OnSendChat}>
                    <SendButtonImage src={sendIcon}></SendButtonImage>
                </SendButton>
            </ChatInputArea>
            <ChatList ref={ChatListRef}>
                {chatList ? chatList.map(x=>
                (x.userID === Container.curUser.getUserID()) ?
                    <MyChatContainer><MyChat>{x.content}</MyChat></MyChatContainer> : 
                    <div><Chat>{x.userName} : {x.content}</Chat></div>)
                 : <div></div>}
            </ChatList>
        </ChatArea>
    );
}

export default ChatControl;