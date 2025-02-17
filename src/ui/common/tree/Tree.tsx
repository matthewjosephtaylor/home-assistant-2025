import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
} from "@mui/material";

/**
 * Minimal node structure.
 * - `hasChildren` used to decide if we should recursively render more columns.
 */
export type TreeNode = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  hasChildren?: boolean;
};

/**
 * A function to load children for a given parentId and optional search query.
 * If `parentId` is undefined, we are at the root.
 */
export type LoadChildrenFn = (
  parentId?: string,
  query?: string
) => Promise<TreeNode[]>;

/**
 * RecursiveNode:
 * - Renders its own search bar (searches only *this* node's children).
 * - Displays the returned children in a List.
 * - For each child that has children, recursively renders another column to the right.
 */
export const RecursiveNode: React.FC<{
  parentId?: string;
  loadChildren: LoadChildrenFn;
}> = ({ parentId, loadChildren }) => {
  const [search, setSearch] = useState<string>();
  const [children, setChildren] = useState<TreeNode[]>([]);

  // Fetch children whenever the parentId or search changes
  useEffect(() => {
    loadChildren(parentId, search).then((result) => setChildren(result));
  }, [parentId, search, loadChildren]);

  // If there are no children, don't render anything at this level
  if (!children.length) return null;

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" gap={2}>
      {/* Left portion: Search bar and list of children */}
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
              <ListItem>
                {child.icon && <ListItemIcon>{child.icon}</ListItemIcon>}
                <ListItemText primary={child.label} />
              </ListItem>
              {idx < children.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Right portion: For each child that hasChildren, recursively render more columns */}
      {children.map((child) => {
        if (child.hasChildren) {
          return (
            <RecursiveNode
              key={`${child.id}-children`}
              parentId={child.id}
              loadChildren={loadChildren}
            />
          );
        }
        return null;
      })}
    </Box>
  );
};

/**
 * TreeView:
 * - Entry point for the entire tree (root).
 * - Just renders a RecursiveNode with no parentId (meaning root).
 */
export const TreeView: React.FC<{
  loadChildren: LoadChildrenFn;
}> = ({ loadChildren }) => {
  return <RecursiveNode parentId={undefined} loadChildren={loadChildren} />;
};

/*
 * Example Usage / Fake Data
 * -------------------------
 * This part is just a simple demonstration of how you might wire
 * up a "loadChildren" function that returns data from some source.
 */
