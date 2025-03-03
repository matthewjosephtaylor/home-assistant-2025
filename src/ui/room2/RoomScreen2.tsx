import { Box, Stack, Typography } from "@mui/material";
import { TreeView } from "../common/tree/TreeView";
import { rootTreeApi } from "../room/rootTreeApi";
import { ChatBox } from "../room/ChatBox";
import { SearchBar } from "../common/tree/SearchBar";
import { NoteItem } from "../common/tree/NoteItem";

export const RoomScreen2 = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "99.9vh",
      }}
    >
      <TreeView treeApi={rootTreeApi} />
      <ChatBox treeApi={rootTreeApi} />
    </Stack>
  );
};
