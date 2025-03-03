import {
  MessageInput,
  type MessageInputProps,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import type { TreeApi } from "../common/tree/TreeApi";
import { handleTextEntry } from "./handleTextEntry";
import "./room-screen.scss";
import { Box, styled } from "@mui/system";

const StyledMessageInput = styled(MessageInput)({
  display: "flex",
  flexDirection: "row",
  flex: 1,
  flexShrink: 1,
});

export const ChatBox = ({
  treeApi,
  ...rest
}: { treeApi: TreeApi } & MessageInputProps) => {
  return (
    <Box>
      <StyledMessageInput
        placeholder="Type message here"
        onSend={async (innerHtml, textContent, innerText) => {
          await handleTextEntry({ text: textContent, treeApi });
        }}
        {...rest}
      />
    </Box>
  );
};
