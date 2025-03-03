import { Stack } from "@mui/material";
import { TreeView } from "../common/tree/TreeView";
import { ChatBox } from "./ChatBox";
import { rootTreeApi } from "./rootTreeApi";

export const RoomScreen = () => {
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
