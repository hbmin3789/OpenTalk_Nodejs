import React from 'react';
import styled from 'styled-components';
import Container from '../../libs/common/container';
import {setSocketEvent} from '../../libs/network/websocketEvents';
import ChatItem from '../../libs/room/chatItem';
import RoomInfo from '../../libs/room/roomInfo';
import sendIcon from '../../assets/send.png';

type Props = {
    room: RoomInfo;
    onUserEnter: any;
}

const ResponseWidth = 1000;
const MobileWidth = 500;

const ChatArea = styled.div`
  @media screen and (max-width: ${ResponseWidth}px){
    height: 20rem;
    width: 100%;
  }
  display: flex;
  flex-direction: column-reverse;
  width: 30rem;
  background-color: #ededed;
`;

const ChatList = styled.ul`
  @media screen and (max-width: ${ResponseWidth}px){
    height: 10rem;
  }
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
  @media screen and (max-width: ${ResponseWidth}px){
    min-width: 2rem;
  }
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
  @media screen and (max-width: ${ResponseWidth}px){
    font-size: 1rem;
    min-width: 0;
  }
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

const UserEnterChat = styled.div`
    display: block;
    text-align: center;
    padding: 0.5rem 1.5rem;
    margin: 1rem;
    font-size: 1.5rem;
    border-radius: 1rem 1rem 1rem 0rem;
`;

export const ChatControl = ({onUserEnter, room}: Props) => {
    let [content, setContent] = React.useState<string>("");
    let [chatList, setChatList] = React.useState<Array<ChatItem>>(new Array<ChatItem>());
    let ChatInputRef = React.useRef<HTMLInputElement>(null);
    let ChatListRef = React.useRef<HTMLUListElement>(null);

    onUserEnter.userEnter = (userName: string) => {      
        let newChat = new ChatItem();
        newChat.content = userName + "님이 입장하셨습니다.";
        newChat.userID = "";
        setChatList([...chatList,newChat]);
    };

    onUserEnter.userLeave = (userName: string) => {      
      let newChat = new ChatItem();
      newChat.content = userName + "님이 퇴장하셨습니다.";
      newChat.userID = "";
      setChatList([...chatList,newChat]);
  };
    

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
                    전송
                </SendButton>
            </ChatInputArea>
            <ChatList ref={ChatListRef}>
                {chatList ? chatList.map(x=>
                (x.userID === Container.curUser.getUserID()) ?
                    <MyChatContainer><MyChat>{x.content}</MyChat></MyChatContainer> : 
                    (x.userID === "") ? 
                      <div><UserEnterChat>{x.content}</UserEnterChat></div> : 
                      <div><Chat>{x.userName} : {x.content}</Chat></div>)
                 : <div></div>}
            </ChatList>
        </ChatArea>
    );
}

export default ChatControl;