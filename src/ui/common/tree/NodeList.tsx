import { Divider, List, type ListProps } from "@mui/material";
import { NodeItem } from "./NodeItem";
import { isDefined, toMany } from "@mjt-engine/object";
import type { TreeNode } from "./TreeNode";

export const NodeList = ({
  children,
  selectedChildId,
  setSelectedChildId,
  onOpenEditor,
  handleDelete,
  ...rest
}: {
  children: TreeNode[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
  handleDelete: (nodeId: string) => void;
} & Omit<ListProps, "children">) => (
  <List
    sx={{
      bgcolor: "background.paper",
      border: (theme) => `1px solid ${theme.palette.divider}`,
      borderRadius: 1,
      height: "80vh",
      // height: "50vh", // Use full height of the parent container
      overflow: "auto",
    }}
    {...rest}
  >
    {toMany(children)
      .filter(isDefined)
      .map((child) => (
        <NodeItem
          key={child.id}
          child={child}
          selectedChildId={selectedChildId}
          setSelectedChildId={setSelectedChildId}
          // hoveredId={hoveredId}
          // setHoveredId={setHoveredId}
          onOpenEditor={onOpenEditor}
          handleDelete={handleDelete}
        />
      ))}
    {children.length > 0 && <Divider component="li" />}
  </List>
);
