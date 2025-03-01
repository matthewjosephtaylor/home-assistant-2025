import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, IconButton, ListItemButton } from "@mui/material";
import React from "react";

export const NodeItem: React.FC<{
  child: any;
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
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
  hoveredId,
  setHoveredId,
  onOpenEditor,
  handleDelete,
}) => (
  <React.Fragment key={child.id}>
    <ListItemButton
      selected={selectedChildId === child.id}
      onClick={() => setSelectedChildId(child.id)}
      onMouseEnter={() => setHoveredId(child.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {child.content}
      {hoveredId === child.id && (
        <Box display="flex" flexDirection="row" sx={{ ml: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditor({ nodeId: child.id, mode: "edit" });
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditor({ parentId: child.id, mode: "add" });
            }}
          >
            <AddCircleIcon fontSize="small" />
          </IconButton>
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
    <Divider component="li" />
  </React.Fragment>
);
