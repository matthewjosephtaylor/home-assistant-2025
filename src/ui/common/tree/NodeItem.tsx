import { Divider, ListItemButton, Stack } from "@mui/material";
import React from "react";
import ContextMenu from "../ContextMenu";
import type { TreeNode } from "./TreeNode";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
export const NodeItem: React.FC<{
  child: TreeNode;
  selectedChildId: string | null | undefined;
  setSelectedChildId: (id: string | null | undefined) => void;
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
            ? setSelectedChildId(child.parentId)
            : setSelectedChildId(child.id)
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ContextMenu
          actions={{
            Edit: {
              icon: <EditIcon />,
              action: () => onOpenEditor({ nodeId: child.id, mode: "edit" }),
            },
            Add: {
              icon: <AddCircleIcon />,
              action: () => onOpenEditor({ parentId: child.id, mode: "add" }),
            },

            Delete: {
              icon: <DeleteIcon />,
              action: () => handleDelete(child.id),
            },
          }}
        >
          <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems="center"
            gap={"1ch"}
          >
            {child.content}
          </Stack>
        </ContextMenu>
      </ListItemButton>
      <Divider component="li" />
    </React.Fragment>
  );
};
