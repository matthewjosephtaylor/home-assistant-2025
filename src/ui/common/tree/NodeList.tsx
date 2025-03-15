import { isDefined, toMany } from "@mjt-engine/object";
import { Divider, List, type ListProps } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import { NodeItem } from "./NodeItem";
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
  selectedChildId: string | undefined | null;
  setSelectedChildId: (id: string | null | undefined) => void;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
  handleDelete: (nodeId: string) => void;
} & Omit<ListProps, "children">) => {
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handleScrollToBottom = () => {
      listElement.scrollTop = listElement.scrollHeight;
    };

    handleScrollToBottom(); // Scroll to bottom on initial render

    const mutationObserver = new MutationObserver(handleScrollToBottom);
    mutationObserver.observe(listElement, { childList: true });

    const resizeObserver = new ResizeObserver(handleScrollToBottom);
    Array.from(listElement.children).forEach((child) =>
      resizeObserver.observe(child)
    );

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
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
