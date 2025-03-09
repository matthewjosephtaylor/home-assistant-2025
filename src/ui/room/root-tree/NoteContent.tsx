import { IconButton } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useAppState } from "../../../state/AppState";
import NoteIcon from "@mui/icons-material/Note";
import { TextDialog } from "../../crud/TextDialog";
import { useState } from "react";
import { useData } from "../../../state/useData";
import {
  CONTENT_OBJECT_STORE,
  type Content,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { putContent } from "../../common/putContent";
import { Ids } from "@mjt-services/data-common-2025";
import { isUndefined } from "@mjt-engine/object";
import { putRoom } from "../../common/putRoom";

export const NoteContent = ({ parentId }: { parentId?: string }) => {
  const activeNoteParentId = useAppState((state) => state.activeNoteParentId);
  const [openNote, setOpenNote] = useState(false);
  const room = useData<Room>(parentId);
  console.log("NoteContent room", room);
  const contextContent = useData<Content>(room?.contextId);
  console.log("NoteContent contextContent", contextContent);

  return (
    <>
      <Stack alignItems={"center"} direction={"row"} spacing={1}>
        <Box
          flexGrow={1}
          sx={{
            height: "0.5em",
            borderRadius: 1,
            backgroundColor: (theme) =>
              parentId === activeNoteParentId
                ? theme.palette.primary.dark
                : theme.palette.grey[100],
          }}
        />
        <IconButton
          onClick={() => {
            setOpenNote(true);
          }}
        >
          <NoteIcon />
        </IconButton>
      </Stack>
      <TextDialog
        open={openNote}
        value={String(contextContent?.value || "")}
        onClose={() => setOpenNote(false)}
        onSave={(value: string) => {
          console.log("saving note", value);
          const contextContentId =
            contextContent?.id ?? Ids.fromObjectStore(CONTENT_OBJECT_STORE);
          putContent({
            id: contextContentId,
            value,
            contentType: "text/plain",
          });
          if (isUndefined(room?.contextId)) {
            putRoom({
              ...room,
              contextId: contextContentId,
            });
          }
        }}
      />
    </>
  );
};
