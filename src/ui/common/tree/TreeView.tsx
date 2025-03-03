import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import { RecursiveNode } from "./RecursiveNode";
import { type TreeApi } from "./TreeApi";

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
        treeApi
          .addChild(editorParentId, formData)
          .then(() => setEditorOpen(false));
      } else if (editorMode === "edit" && editorNodeId) {
        treeApi
          .updateNode(editorNodeId, formData)
          .then(() => setEditorOpen(false));
      }
      // Close
      setEditorOpen(false);
    },
  });

  return (
    <Stack sx={{ margin: "2em" }}>
      {/* Top-level RecursiveNode (no parentId => 'root') */}
      <RecursiveNode
        parentId={undefined}
        treeApi={treeApi}
        onOpenEditor={handleOpenEditor}
      />

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
    </Stack>
  );
};
