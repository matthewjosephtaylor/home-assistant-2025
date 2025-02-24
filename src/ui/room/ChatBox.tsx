import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./room-screen.scss";
import {
  ChatContainer,
  MainContainer,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import { ChatLangs } from "../../chatlang/ChatLangs";
import type { TreeApi } from "../common/tree/TreeApi";
import { TEXT_ENTRY_EVALUATOR } from "./TEXT_ENTRY_EVALUATOR";

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
            const out = await ChatLangs.interpretText(
              textContent,
              TEXT_ENTRY_EVALUATOR(treeApi)
            );
            console.log("out", out);
          }}
        />
      </ChatContainer>
    </MainContainer>
  );
};
