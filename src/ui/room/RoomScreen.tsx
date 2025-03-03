import { Box, Stack, Typography } from "@mui/material";
import { TreeView } from "../common/tree/TreeView";
import { ChatBox } from "./ChatBox";
import { rootTreeApi } from "./rootTreeApi";

export const RoomScreen = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="99.9vh"
    >
      <Stack
        sx={{ width: "100%", height: "100%", margin: "1em" }}
        direction="column"
      >
        <Box>
          <Typography variant="h4">Rooms</Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            height: "100%", // Use full height of the parent container
          }}
        >
          <TreeView treeApi={rootTreeApi} />
        </Box>
        <Box
          sx={{
            flexShrink: 1,
            // height: "100%", // Use full height of the parent container
          }}
        >
          <ChatBox treeApi={rootTreeApi} />
        </Box>
      </Stack>
    </Box>
  );
};
