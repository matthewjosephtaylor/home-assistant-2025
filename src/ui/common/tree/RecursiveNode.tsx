import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { getConnection } from "../../../connection/Connections";
import { useAppState } from "../../../state/AppState";
import { focusTextEntry } from "../../../state/focusTextEntry";
import { NoteContent } from "../../room/root-tree/NoteContent";
import { NodeList } from "./NodeList";
import { SearchBar } from "./SearchBar";
import { useTreeNodes } from "./useTreeNodes";

export const RecursiveNode = ({
  parentId,
  onOpenEditor,
}: {
  parentId?: string;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "edit";
  }) => void;
}) => {
  const [search, setSearch] = useState("");
  const { activeRoomId, setActiveRoomId } = useAppState();
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>();
  const children = useTreeNodes({ parentId, search });

  useEffect(() => {
    if (selectedChildId && !children.some((n) => n.id === selectedChildId)) {
      setSelectedChildId(undefined);
      // setActiveNoteParentId(parentId);
    }
    if (activeRoomId && children.some((n) => n.id === activeRoomId)) {
      setSelectedChildId(activeRoomId);
      focusTextEntry();
    }
  }, [parentId, selectedChildId, children]);

  const handleDelete = async (nodeId: string) => {
    Datas.remove(await getConnection())({
      objectStore: ROOM_OBJECT_STORE,
      query: nodeId,
    });
  };

  const handleSelectNote = () => {
    setActiveRoomId(parentId);
  };

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "flex-start",
        gap: 2,
        height: "100%",
      }}
    >
      <Stack
        sx={{
          // minWidth: "20ch",
          height: "100%",
        }}
      >
        <SearchBar search={search} setSearch={setSearch} />
        <NodeList
          children={children}
          selectedChildId={activeRoomId}
          setSelectedChildId={(id) => {
            focusTextEntry();
            setActiveRoomId(id);
            setSelectedChildId(id);
          }}
          onOpenEditor={onOpenEditor}
          handleDelete={handleDelete}
        />

        <Box onClick={handleSelectNote}>
          <NoteContent parentId={parentId}></NoteContent>
        </Box>
      </Stack>
      {selectedChildId && (
        <RecursiveNode parentId={selectedChildId} onOpenEditor={onOpenEditor} />
      )}
    </Stack>
  );
};
