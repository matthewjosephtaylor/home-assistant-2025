import { Stack } from "@mui/material";
import { TreeView } from "../common/tree/TreeView";
import { rootTreeApi } from "./root-tree/rootTreeApi";
import { TextEntry } from "./TextEntry";
import { useRef, useLayoutEffect } from "react";

export const RoomScreen = () => {
  return (
    <Stack
      sx={{
        marginLeft: "5ch",
        marginRight: "5ch",
        height: "99.9vh",
      }}
    >
      <TreeView
        treeApi={rootTreeApi}
        sx={{
          height: "100%",
          maxHeight: "calc(100vh - 7em)",
          maxWidth: "calc(100vw - 10ch)",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      />
      <TextEntry treeApi={rootTreeApi} />
    </Stack>
  );
};
