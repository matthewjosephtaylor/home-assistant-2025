import {
  ChatContainer,
  MainContainer,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import type { TreeApi } from "../common/tree/TreeApi";
import { handleTextEntry } from "./handleTextEntry";
import "./room-screen.scss";

export const ChatBox = ({ treeApi }: { treeApi: TreeApi }) => {
  return (
    <MainContainer className="dark">
      <ChatContainer>
        <MessageList>
          <MessageList />
        </MessageList>
        <MessageInput
          placeholder="Type message here"
          onSend={async (innerHtml, textContent, innerText) => {
            await handleTextEntry({ text: textContent, treeApi });
          }}
        />
      </ChatContainer>
    </MainContainer>
  );
};
