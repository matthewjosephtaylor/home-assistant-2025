import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

/**
 * Minimal node structure for the tree.
 */
export type TreeNode = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

/**
 * Our "Tree API" includes all the needed CRUD methods
 * plus special methods for notes.
 */
export type TreeApi = {
  /**
   * Load the child nodes of a given parent.
   */
  loadChildren: (parentId?: string, query?: string) => Promise<TreeNode[]>;

  /**
   * Add a child under a given parent.
   */
  addChild: (parentId: string, data: any) => Promise<TreeNode>;

  /**
   * Update a node by ID.
   */
  updateNode: (nodeId: string, data: any) => Promise<TreeNode>;

  /**
   * Remove a node by ID.
   */
  removeNode: (nodeId: string) => Promise<void>;

  /**
   * Return the editor form for adding or updating a node.
   * This function must accept enough info to know what form to render
   * and also handle OK/Cancel.
   */
  getEditorForm: (options: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onOk: (formData: any) => void;
  }) => React.ReactNode;

  /**
   * Which note (by parentId) is currently selected / active?
   */
  getActiveNoteParentId: () => string | undefined;

  /**
   * Set which note (by parentId) is currently selected / active.
   */
  setActiveNoteParentId: (pid?: string) => void;

  /**
   * Render the note’s content for a particular parentId.
   * This is a React component you provide (could be a text field, etc.).
   */
  renderNoteContent: (parentId?: string) => React.ReactNode;
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
  const [children, setChildren] = useState<TreeNode[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Load children whenever parentId or search changes
  useEffect(() => {
    treeApi
      .loadChildren(parentId, search)
      .then((result) => {
        setChildren(result);
        // If a previously selected child no longer exists, clear it
        if (selectedChildId && !result.some((n) => n.id === selectedChildId)) {
          setSelectedChildId(null);
        }
      })
      .catch(() => {
        setChildren([]);
      });
  }, [parentId, search, treeApi]);

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

/**
 * The main TreeView component holds the top-level RecursiveNode and
 * the editor dialog. We rely on treeApi.getActiveNoteParentId() / .setActiveNoteParentId().
 */
export const TreeView: React.FC<{ treeApi: TreeApi }> = ({ treeApi }) => {
  // Editor dialog state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"add" | "edit">("add");
  const [editorParentId, setEditorParentId] = useState<string | undefined>();
  const [editorNodeId, setEditorNodeId] = useState<string | undefined>();

  // Called by RecursiveNode to open the editor
  const handleOpenEditor = (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => {
    setEditorParentId(params.parentId);
    setEditorNodeId(params.nodeId);
    setEditorMode(params.mode);
    setEditorOpen(true);
  };

  // Get the form from the TreeApi
  const editorForm = treeApi.getEditorForm({
    parentId: editorParentId,
    nodeId: editorNodeId,
    mode: editorMode,
    onCancel: () => setEditorOpen(false),
    onOk: (formData: any) => {
      // By default, let's handle add/update here
      if (editorMode === "add" && editorParentId) {
        treeApi.addChild(editorParentId, formData).then(() => setEditorOpen(false));
      } else if (editorMode === "edit" && editorNodeId) {
        treeApi.updateNode(editorNodeId, formData).then(() => setEditorOpen(false));
      }
      // Close
      setEditorOpen(false);
    },
  });

  return (
    <div>
      {/* Top-level RecursiveNode (no parentId => 'root') */}
      <RecursiveNode parentId={undefined} treeApi={treeApi} onOpenEditor={handleOpenEditor} />

      {/* Editor dialog */}
      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editorMode === "add" ? "Add Child" : "Edit Node"}
        </DialogTitle>
        <DialogContent>{editorForm}</DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // If your form doesn't have its own "OK" button,
              // call the onOk callback or handle submission here.
            }}
            color="primary"
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
