import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import type { TreeNode } from "./TreeNode";
import type { TreeApi } from "./TreeApi";
import { Messages, parseSubject } from "@mjt-engine/message";
import type { DATA_EVENT_MAP } from "@mjt-services/data-common-2025";
import { getConnection } from "../../../connection/Connections";
import { useConnection } from "../../../connection/useConnection";

export const useTreeNodes = ({
  treeApi,
  parentId,
  search,
}: {
  treeApi: TreeApi;
  parentId?: string;
  search: string;
}): TreeNode[] => {
  const connectionInstance = useConnection();
  const [children, setChildren] = useState<TreeNode[]>([]);

  const realizeChildren = async (
    parentId: string | undefined,
    search: string
  ) => {
    return treeApi.loadChildren(parentId, search);
  };
  useEffect(() => {
    const abortController = new AbortController();
    if (!connectionInstance) {
      return;
    }
    Messages.connectEventListenerToSubjectRoot<
      "update",
      typeof DATA_EVENT_MAP,
      Record<string, string>
    >({
      connection: connectionInstance.connection,
      subjectRoot: "update",
      signal: abortController.signal,
      listener: async (event) => {
        console.log(`update event for ${parentId}`, event);
        const { root, subpath } = Messages.parseSubject(event.subject);
        console.log("root", root);
        console.log("subpath", subpath);
        if (subpath !== parentId) {
          return;
        }
        const children = await realizeChildren(subpath, search);
        setChildren(children);
      },
    });
    realizeChildren(parentId, search).then((result) => {
      setChildren(result);
    });
    return () => {
      abortController.abort();
    };
  }, [connectionInstance, parentId, search, treeApi]);

  console.log("useTreeNodes: children", children);
  return children;
};

/**
 * A RecursiveNode that lists:
 * 1) Its children
 * 2) At the very bottom, the custom "note" area
 */
export const RecursiveNode: React.FC<{
  parentId?: string;
  treeApi: TreeApi;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
}> = ({ parentId, treeApi, onOpenEditor }) => {
  // A fallback for top-level
  const currentParentId = parentId ?? "root";

  const [search, setSearch] = useState("");
  // const [children, setChildren] = useState<TreeNode[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const children = useTreeNodes({ treeApi, parentId, search });

  if (selectedChildId && !children.some((n) => n.id === selectedChildId)) {
    setSelectedChildId(null);
  }
  // Load children whenever parentId or search changes
  // useEffect(() => {
  //   treeApi
  //     .loadChildren(parentId, search)
  //     .then((result) => {
  //       setChildren(result);
  //       // If a previously selected child no longer exists, clear it
  //       if (selectedChildId && !result.some((n) => n.id === selectedChildId)) {
  //         setSelectedChildId(null);
  //       }
  //     })
  //     .catch(() => {
  //       setChildren([]);
  //     });
  // }, [parentId, search, treeApi]);

  // Handle node deletion
  const handleDelete = async (nodeId: string) => {
    try {
      await treeApi.removeNode(nodeId);
      // Force a refresh by nudging search
      setSearch((prev) => prev + " ");
    } catch (err) {
      console.error("Failed to remove node:", err);
    }
  };

  const handleSelectNote = () => {
    treeApi.setActiveNoteParentId(currentParentId);
  };

  // Check if this node's note is currently selected
  const isNoteSelected = treeApi.getActiveNoteParentId() === currentParentId;

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" gap={2}>
      {/* Left side: Search + list */}
      <Box sx={{ minWidth: 240 }}>
        <TextField
          variant="outlined"
          size="small"
          label="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <List
          sx={{
            bgcolor: "background.paper",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          {children.map((child, idx) => (
            <React.Fragment key={child.id}>
              <ListItemButton
                selected={selectedChildId === child.id}
                onClick={() => setSelectedChildId(child.id)}
                onMouseEnter={() => setHoveredId(child.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {child.icon && <ListItemIcon>{child.icon}</ListItemIcon>}
                <ListItemText primary={child.label} />
                {hoveredId === child.id && (
                  <Box display="flex" flexDirection="row" sx={{ ml: 1 }}>
                    {/* Edit */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditor({ nodeId: child.id, mode: "edit" });
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {/* Add Child */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditor({ parentId: child.id, mode: "add" });
                      }}
                    >
                      <AddCircleIcon fontSize="small" />
                    </IconButton>
                    {/* Delete */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(child.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </ListItemButton>
              {idx < children.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}

          {/* Divider before note if there are any children */}
          {children.length > 0 && <Divider component="li" />}

          {/* The note item at the bottom */}
          <ListItemButton
            selected={isNoteSelected}
            onClick={handleSelectNote}
            onMouseEnter={() => setHoveredId("NOTE-" + currentParentId)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <ListItemText
              primary={treeApi.renderNoteContent(currentParentId)}
            />
          </ListItemButton>
        </List>
      </Box>

      {/* Right side: if a real child is selected, show its children */}
      {selectedChildId && (
        <RecursiveNode
          parentId={selectedChildId}
          treeApi={treeApi}
          onOpenEditor={onOpenEditor}
        />
      )}
    </Box>
  );
};
