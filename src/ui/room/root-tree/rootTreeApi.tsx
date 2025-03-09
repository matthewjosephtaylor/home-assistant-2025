import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { getConnection } from "../../../connection/Connections";
import { useAppState } from "../../../state/AppState";
import { type TreeApi } from "../../common/tree/TreeApi";
import { type TreeNode } from "../../common/tree/TreeNode";
import { ContentView } from "../../ContentView";
import { addUserRoomTextContent } from "../addUserRoomTextContent";
import { NoteContent } from "./NoteContent";
import { loadRootTreeChildren } from "./loadRootTreeChildren";

export const rootTreeApi: TreeApi = {
  loadChildren: loadRootTreeChildren,
  addChild: async function (parentId, data): Promise<TreeNode> {
    const realizedParentId = parentId === "rooms" ? undefined : parentId;
    const id = await addUserRoomTextContent({
      text: data.label,
      parentId: realizedParentId,
    });
    return { id, content: <ContentView contentId={id} /> };
  },
  removeNode: async function (nodeId: string): Promise<void> {
    Datas.remove(await getConnection())({
      objectStore: ROOM_OBJECT_STORE,
      query: nodeId,
    });
  },

  updateNode: function (nodeId: string, data: any): Promise<TreeNode> {
    throw new Error("Function not implemented.");
  },
  getActiveNoteParentId: () => useAppState.getState().activeNoteParentId,
  setActiveNoteParentId: (pid) => {
    useAppState.getState().setActiveNoteParentId(pid);
  },

  // Render note content for each parentId (a React component):
  renderNoteContent: (parentId) => {
    return <NoteContent parentId={parentId} />;
  },

  getEditorForm: ({ parentId, nodeId, mode, onCancel, onOk }) => {
    // If editing, fetch the node details (e.g., from your data store).
    // If adding, use a default form.
    // For example, we do minimal local state:
    const [label, setLabel] = React.useState("");

    // If we're editing an existing node, retrieve it:
    // in a real scenario you might do an async fetch:
    React.useEffect(() => {
      if (mode === "edit" && nodeId) {
        // e.g. fetchNode(nodeId).then(node => setLabel(node.label));
      }
    }, [mode, nodeId]);

    const handleSubmit = async () => {
      // If adding:
      if (mode === "add" && parentId) {
        // E.g., call addChild(...) here
        // await addChild(parentId, { label });
        // Then call onOk
        onOk({ label });
      }

      // If editing:
      if (mode === "edit" && nodeId) {
        // E.g., call updateNode(...) here
        // await updateNode(nodeId, { label });
        onOk({ label });
      }
    };

    // Return a small chunk of form UI
    return (
      <div>
        <p>
          {/* For demonstration, show the ID(s) */}
          mode: {mode}, parentId: {parentId}, nodeId: {nodeId}
        </p>
        <TextField
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
          size="small"
        />
        <Box mt={2}>
          <Button onClick={onCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ ml: 2 }}>
            OK
          </Button>
        </Box>
      </div>
    );
  },
};
