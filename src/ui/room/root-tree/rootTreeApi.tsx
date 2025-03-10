import {
  ROOM_OBJECT_STORE,
  type Content,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { getConnection } from "../../../connection/Connections";
import { useAppState } from "../../../state/AppState";
import { type TreeApi } from "../../common/tree/TreeApi";
import { type TreeNode } from "../../common/tree/TreeNode";
import { ContentView } from "../../content/ContentView";
import { addUserRoomTextContent } from "../addUserRoomTextContent";
import { NoteContent } from "./NoteContent";
import { loadRootTreeChildren } from "./loadRootTreeChildren";
import { useData } from "../../../state/useData";
import { TextDialog } from "../../crud/TextDialog";
import { putContent } from "../../common/putContent";

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
    const room = useData<Room>(nodeId);
    const content = useData<Content>(room?.contentId);
    console.log("Room content", content);
    const [open, setOpen] = React.useState(true);

    // Return a small chunk of form UI
    return (
      <>
        <TextDialog
          open={open}
          value={String(content?.value) || ""}
          onClose={() => {
            setOpen(false);
            onCancel();
          }}
          onSave={(value: string) => {
            putContent({
              id: content?.id,
              value,
            });
            setOpen(false);
            onCancel();
          }}
        />
      </>
    );
  },
};
