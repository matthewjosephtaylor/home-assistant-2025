import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Box, Button, Stack } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { getConnection } from "../../../connection/Connections";
import { NodeList } from "./NodeList";
import { SearchBar } from "./SearchBar";
import type { TreeApi } from "./TreeApi";
import { useTreeNodes } from "./useTreeNodes";
import { NoteItem } from "./NoteItem";

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
  const [selectedChildId, setSelectedChildId] = useState<
    string | null | undefined
  >(null);
  const children = useTreeNodes({ treeApi, parentId, search });

  const noteContent = treeApi.renderNoteContent(currentParentId);

  if (selectedChildId && !children.some((n) => n.id === selectedChildId)) {
    setSelectedChildId(null);
    treeApi.setActiveNoteParentId(currentParentId);
  }

  const handleDelete = async (nodeId: string) => {
    await treeApi.removeNode(nodeId);
  };

  const handleSelectNote = () => {
    treeApi.setActiveNoteParentId(currentParentId);
  };

  const isNoteSelected = treeApi.getActiveNoteParentId() === currentParentId;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "flex-start",
        gap: 2,
        height: "100%",
      }}
    >
      <Stack sx={{ minWidth: "20ch", height: "100%" }}>
        <SearchBar search={search} setSearch={setSearch} />
        <NodeList
          children={children}
          selectedChildId={selectedChildId}
          setSelectedChildId={setSelectedChildId}
          onOpenEditor={onOpenEditor}
          handleDelete={handleDelete}
        />
        <NoteItem
          sx={{ backgroundColor: isNoteSelected ? "red" : "black" }}
          selected={isNoteSelected}
          onClick={handleSelectNote}
          value={noteContent}
        />
      </Stack>
      {selectedChildId && (
        <RecursiveNode
          parentId={selectedChildId}
          treeApi={treeApi}
          onOpenEditor={onOpenEditor}
        />
      )}
    </Stack>
  );
};
