import { Divider, List, type ListProps } from "@mui/material";
import { NodeItem } from "./NodeItem";
import { isDefined, toMany } from "@mjt-engine/object";
import type { TreeNode } from "./TreeNode";
import { useEffect, useRef } from "react";

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
} & Omit<ListProps, "children">) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <List
      ref={listRef}
      sx={{
        bgcolor: "background.paper",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        height: "80vh",
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
            onOpenEditor={onOpenEditor}
            handleDelete={handleDelete}
          />
        ))}
      {children.length > 0 && <Divider component="li" />}
    </List>
  );
};