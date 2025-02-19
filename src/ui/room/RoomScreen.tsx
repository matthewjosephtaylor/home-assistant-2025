import { Box, Stack } from "@mui/material";
import { TreeView } from "../common/tree/Tree";
import { ChatBox } from "./ChatBox";
import { rootTreeApi } from "./rootTreeApi";

export const RoomScreen = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Stack>
        <TreeView treeApi={rootTreeApi} />
        <ChatBox />
      </Stack>
    </Box>
  );
};
