// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./room-screen.scss";

import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";

export const ChatBox = () => {
  return (
    <MainContainer className="dark">
      <ChatContainer>
        <MessageList>
          <MessageList />
          <Message
            model={{
              message: "Hello Joe",
              sentTime: "just now",

              direction: "incoming",
              position: "normal",
            }}
          />
        </MessageList>
        <MessageInput
          placeholder="Type message here"
          onSend={(innerHtml, textContent, innerText) => {
            console.log("html", innerHtml);
            console.log("content", textContent);
            console.log("text", innerText);
          }}
        />
      </ChatContainer>
    </MainContainer>
  );
};
