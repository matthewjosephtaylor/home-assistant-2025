import React from "react";
import { Box, Typography } from "@mui/material";

// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./room-screen.scss";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

export const RoomScreen = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4">Room goes here</Typography>
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer className="dark">
          <ChatContainer>
            <MessageList>
              <Message
                model={{
                  message: "Hello my friend",
                  sentTime: "just now",
                  sender: "Joe",
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
      </div>
      ;
    </Box>
  );
};
