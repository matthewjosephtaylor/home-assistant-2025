import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  type StackProps,
} from "@mui/material";
import { useState } from "react";
import { TreeEditorForm } from "../../room/root-tree/TreeEditorForm";
import { RecursiveNode } from "./RecursiveNode";

/**
 * The main TreeView component holds the top-level RecursiveNode and
 * the editor dialog. We rely on treeApi.getActiveNoteParentId() / .setActiveNoteParentId().
 */

export const TreeView = ({ ...rest }: StackProps) => {
  // Editor dialog state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"edit">("edit");
  const [editorParentId, setEditorParentId] = useState<string | undefined>();
  const [editorNodeId, setEditorNodeId] = useState<string | undefined>();

  // Called by RecursiveNode to open the editor
  const handleOpenEditor = (params: {
    parentId?: string;
    nodeId?: string;
    mode: "edit";
  }) => {
    setEditorParentId(params.parentId);
    setEditorNodeId(params.nodeId);
    setEditorMode(params.mode);
    setEditorOpen(true);
  };

  // // Get the form from the TreeApi
  // const editorForm = treeApi.getEditorForm({
  //   parentId: editorParentId,
  //   nodeId: editorNodeId,
  //   mode: editorMode,
  //   onCancel: () => setEditorOpen(false),
  //   onOk: (formData: any) => {
  //     // By default, let's handle add/update here
  //     if (editorMode === "add" && editorParentId) {
  //       treeApi
  //         .addChild(editorParentId, formData)
  //         .then(() => setEditorOpen(false));
  //     } else if (editorMode === "edit" && editorNodeId) {
  //       treeApi
  //         .updateNode(editorNodeId, formData)
  //         .then(() => setEditorOpen(false));
  //     }
  //     // Close
  //     setEditorOpen(false);
  //   },
  // });

  return (
    <Stack {...rest}>
      {/* Top-level RecursiveNode (no parentId => 'root') */}
      <RecursiveNode parentId={undefined} onOpenEditor={handleOpenEditor} />

      {/* Editor dialog */}
      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{"Edit"}</DialogTitle>
        <DialogContent>
          <TreeEditorForm
            open={editorOpen}
            nodeId={editorNodeId}
            onClose={() => setEditorOpen(false)}
          />
        </DialogContent>
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
