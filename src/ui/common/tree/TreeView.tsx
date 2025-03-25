import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Stack, type StackProps } from "@mui/material";
import { useEffect, useState } from "react";
import { useDatas } from "../../../state/useDatas";
import { TreeEditorForm } from "../../room/root-tree/TreeEditorForm";
import { RecursiveNode } from "./RecursiveNode";
import { stableHash } from "stable-hash";
import { Bytes } from "@mjt-engine/byte";

/**
 * The main TreeView component holds the top-level RecursiveNode and
 * the editor dialog. We rely on treeApi.getActiveNoteParentId() / .setActiveNoteParentId().
 */

export const TreeView = ({
  parentId,
  ...rest
}: StackProps & { parentId?: string }) => {
  // Editor dialog state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorNodeId, setEditorNodeId] = useState<string | undefined>();

  const [key, setKey] = useState<string>();
  const roots = useDatas({
    from: ROOM_OBJECT_STORE,
    query: "values(@)|[?parentId == null]",
  });

  useEffect(() => {
    const stable = stableHash(roots);
    Bytes.addressStringOf({ bytes: stable }).then((hash) => {
      setKey(hash);
    });
  }, [roots]);

  // Called by RecursiveNode to open the editor
  const handleOpenEditor = (params: {
    parentId?: string;
    nodeId?: string;
    mode: "edit";
  }) => {
    setEditorNodeId(params.nodeId);
    setEditorOpen(true);
  };
  console.log("key", key);

  return (
    <Stack {...rest}>
      <RecursiveNode
        key={key}
        parentId={parentId}
        onOpenEditor={handleOpenEditor}
      />
      <TreeEditorForm
        open={editorOpen}
        nodeId={editorNodeId}
        onClose={() => setEditorOpen(false)}
      />
    </Stack>
  );
};
