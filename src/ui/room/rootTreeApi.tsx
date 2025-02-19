import { ROOM_OBJECT_STORE, type Room } from "@mjt-services/daimon-common-2025";
import { Datas, Ids } from "@mjt-services/data-common-2025";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { getConnection } from "../../connection/Connections";
import { type TreeApi, type TreeNode } from "../common/tree/Tree";
import { loadDaimons } from "./loadDaimons";
import { loadRooms } from "./loadRooms";

let activeNoteParentId: string | undefined = undefined;

export const rootTreeApi: TreeApi = {
  loadChildren: async (parentId, query) => {
    if (parentId === "daimons") {
      return loadDaimons(parentId, query);
    }
    if (parentId === "rooms") {
      return loadRooms(parentId, query);
    }
    const parsedId = parentId ? Ids.parse(parentId) : undefined;
    if (parsedId) {
      if (parsedId.type === ROOM_OBJECT_STORE.store) {
        return loadRooms(parentId, `values(@)[?parentId == '${parentId}']`);
      }
    }
    if (!parentId) {
      return [
        {
          id: "daimons",
          label: "Daimons",
        },
        {
          id: "rooms",
          label: "Rooms",
        },
      ];
    }
    return [];
  },
  addChild: async function (parentId, data): Promise<TreeNode> {
    console.log("parentId", parentId);
    console.log("data", data);
    const id = Ids.fromObjectStore(ROOM_OBJECT_STORE);
    console.log("id", id);
    const realizedParentId = parentId === "rooms" ? undefined : parentId;
    const resp = await Datas.put(await getConnection())({
      objectStore: ROOM_OBJECT_STORE,
      value: {
        id,
        parentId: realizedParentId,
        content: data.label,
      } as Partial<Room>,
    });
    console.log("resp", resp);
    return { id: resp, label: data.label };
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
  // Handle the currently active note:
  getActiveNoteParentId: () => activeNoteParentId,
  setActiveNoteParentId: (pid) => {
    activeNoteParentId = pid;
    console.log("activeNoteParentId", activeNoteParentId);
    // If you want to trigger a re-render in your app, put this in React state,
    // or if you are using an external store, update it there.
  },

  // Render note content for each parentId (a React component):
  renderNoteContent: (parentId) => (
    <div style={{ fontStyle: "italic", width: "100%" }}>
      {/* Example: show dynamic text or a text field */}
      This is the note area for <b>{parentId}</b>.
      <br />
      {/* Could add your own text input, rich editor, etc. */}
    </div>
  ),

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
