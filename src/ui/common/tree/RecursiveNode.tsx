import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getConnection } from "../../../connection/Connections";
import { NodeList } from "./NodeList";
import { SearchBar } from "./SearchBar";
import type { TreeApi } from "./TreeApi";
import { useTreeNodes } from "./useTreeNodes";

export const RecursiveNode = ({
  parentId,
  treeApi,
  onOpenEditor,
}: {
  parentId?: string;
  treeApi: TreeApi;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
}) => {
  const currentParentId = parentId ?? "root";
  const [search, setSearch] = useState("");
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState<React.ReactNode>(null);
  const children = useTreeNodes({ treeApi, parentId, search });

  useEffect(() => {
    setNoteContent(treeApi.renderNoteContent(currentParentId));
  }, [currentParentId, treeApi]);

  if (selectedChildId && !children.some((n) => n.id === selectedChildId)) {
    setSelectedChildId(null);
  }

  const handleDelete = async (nodeId: string) => {
    await treeApi.removeNode(nodeId);
  };

  const handleSelectNote = () => {
    treeApi.setActiveNoteParentId(currentParentId);
  };

  const isNoteSelected = treeApi.getActiveNoteParentId() === currentParentId;

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" gap={2}>
      <Box sx={{ minWidth: 240 }}>
        <SearchBar search={search} setSearch={setSearch} />
        <Button
          onClick={async () => {
            const children = await treeApi.loadChildren(currentParentId, "");
            const ids = children.map((child) => child.id);
            Datas.remove(await getConnection())({
              objectStore: ROOM_OBJECT_STORE,
              query: ids,
            });
          }}
        >
          Clear
        </Button>
        <NodeList
          children={children}
          selectedChildId={selectedChildId}
          setSelectedChildId={setSelectedChildId}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          onOpenEditor={onOpenEditor}
          handleDelete={handleDelete}
          isNoteSelected={isNoteSelected}
          handleSelectNote={handleSelectNote}
          noteContent={noteContent}
          currentParentId={currentParentId}
        />
      </Box>
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
