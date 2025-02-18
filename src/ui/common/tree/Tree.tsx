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
 * Our "Tree API" includes all needed CRUD methods.
 */
export type TreeApi = {
  loadChildren: (parentId?: string, query?: string) => Promise<TreeNode[]>;

  addChild: (parentId: string, data: any) => Promise<TreeNode>;

  updateNode: (nodeId: string, data: any) => Promise<TreeNode>;

  removeNode: (nodeId: string) => Promise<void>;

  /**
   * Return the editor form for adding or updating a node.
   * This function must accept enough info to know what form to render
   * and also handle OK/Cancel.
   *
   * - parentId is defined for "Add" mode
   * - nodeId is defined for "Edit" mode
   */
  getEditorForm: (options: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onOk: (formData: any) => void;
  }) => React.ReactNode;
};

export const RecursiveNode: React.FC<{
  parentId?: string;
  treeApi: TreeApi;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
}> = ({ parentId, treeApi, onOpenEditor }) => {
  const [search, setSearch] = useState("");
  const [children, setChildren] = useState<TreeNode[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Load children
  useEffect(() => {
    treeApi
      .loadChildren(parentId, search)
      .then((result) => {
        setChildren(result);
        if (!result.some((n) => n.id === selectedChildId)) {
          setSelectedChildId(null);
        }
      })
      .catch(() => {
        setChildren([]);
      });
  }, [parentId, search, selectedChildId, treeApi]);

  if (!children.length) return null;

  const handleDelete = async (nodeId: string) => {
    try {
      await treeApi.removeNode(nodeId);
      // Force a re-fetch
      setSearch((prev) => prev);
    } catch (err) {
      console.error("Failed to remove node:", err);
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" gap={2}>
      {/* Left: Search + list */}
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
        </List>
      </Box>

      {/* Right: selected node’s children */}
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

export const TreeView: React.FC<{ treeApi: TreeApi }> = ({ treeApi }) => {
  // Manage editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"add" | "edit">("add");
  const [editorParentId, setEditorParentId] = useState<string | undefined>();
  const [editorNodeId, setEditorNodeId] = useState<string | undefined>();

  /**
   * Called by RecursiveNode to open the editor
   */
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

  /**
   * We'll render the editor form from the TreeApi.
   * We pass it callbacks for cancel/ok (onCancel, onOk).
   */
  const editorForm = treeApi.getEditorForm({
    parentId: editorParentId,
    nodeId: editorNodeId,
    mode: editorMode,
    onCancel: () => setEditorOpen(false),
    onOk: (formData: any) => {
      // The form can call addChild / updateNode itself,
      // or we can do that here depending on your preference.
      // If it doesn't, do it here:
      if (editorMode === "add" && editorParentId) {
        treeApi
          .addChild(editorParentId, formData)
          .then(() => setEditorOpen(false));
      } else if (editorMode === "edit" && editorNodeId) {
        treeApi
          .updateNode(editorNodeId, formData)
          .then(() => setEditorOpen(false));
      }
      //
      // But if you prefer the form to handle its own submission, just close:
      setEditorOpen(false);
    },
  });

  return (
    <div>
      <RecursiveNode
        parentId={undefined}
        treeApi={treeApi}
        onOpenEditor={handleOpenEditor}
      />

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editorMode === "add" ? "Add Child" : "Edit Node"}
        </DialogTitle>
        <DialogContent>
          {/* The dynamic form from treeApi */}
          {editorForm}
        </DialogContent>
        {/* 
          If your treeApi.getEditorForm() already includes its own Cancel/OK buttons, 
          you may not need these. 
        */}
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // If the form doesn't have its own "OK" button, you might call the onOk callback from here.
              // For example, if treeApi.getEditorForm(...) returns a ref or some callback:
              // formRef.current.submit();
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
