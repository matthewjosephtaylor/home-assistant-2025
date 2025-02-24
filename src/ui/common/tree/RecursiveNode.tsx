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
import React, { useState } from "react";
import type { TreeApi } from "./TreeApi";
import { useTreeNodes } from "./useTreeNodes";

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
