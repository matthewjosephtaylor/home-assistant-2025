import { Box, Divider, ListItemButton, Stack } from "@mui/material";
import React from "react";
import type { TreeNode } from "./TreeNode";
import { NodeItemButtons } from "./NodeItemButtons";

export const NodeItem: React.FC<{
  child: TreeNode;
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
  handleDelete: (nodeId: string) => void;
}> = ({
  child,
  selectedChildId,
  setSelectedChildId,
  onOpenEditor,
  handleDelete,
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <React.Fragment key={child.id}>
      <ListItemButton
        selected={selectedChildId === child.id}
        onClick={() =>
          child.id === selectedChildId
            ? setSelectedChildId(null)
            : setSelectedChildId(child.id)
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
          gap={"1ch"}
        >
          {child.content}
          <NodeItemButtons
            childId={child.id}
            onOpenEditor={onOpenEditor}
            handleDelete={handleDelete}
            visible={hovered}
          />
        </Stack>
      </ListItemButton>
      <Divider component="li" />
    </React.Fragment>
  );
};
