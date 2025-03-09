import { Stack } from "@mui/material";
import { TreeView } from "../common/tree/TreeView";
import { ChatBox } from "./ChatBox";
import { rootTreeApi } from "./root-tree/rootTreeApi";
import ContextMenu from "../common/ContextMenu";

export const RoomScreen = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "99.9vh",
      }}
    >
      <ContextMenu actions={{ foo: () => console.log("foo") }}>
        <TreeView treeApi={rootTreeApi} />
      </ContextMenu>
      <ChatBox treeApi={rootTreeApi} />
    </Stack>
  );
};
