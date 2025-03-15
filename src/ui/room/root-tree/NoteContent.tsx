import { isUndefined } from "@mjt-engine/object";
import {
  CONTENT_OBJECT_STORE,
  type Content,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import NoteIcon from "@mui/icons-material/Note";
import { IconButton, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useAppState } from "../../../state/AppState";
import { useData } from "../../../state/useData";
import { putContent } from "../../common/putContent";
import { putRoom } from "../../common/putRoom";
import { TextDialog } from "../../crud/TextDialog";
import { Colors } from "@mjt-engine/color";

export const NoteContent = ({ parentId }: { parentId?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const activeNoteParentId = useAppState((state) => state.activeNoteParentId);
  const [openNote, setOpenNote] = useState(false);
  const room = useData<Room>(parentId);
  const contextContent = useData<Content>(room?.contextId);
  const backgroundColor = Colors.from("grey").darken(0.3).toString();
  const isActive = parentId === activeNoteParentId;
  useEffect(() => {
    if (!isActive) {
      return;
    }
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [isActive]);

  return (
    <>
      <Tooltip title={"Click to Select"}>
        <Stack
          ref={ref}
          sx={{
            height: "1em",
            backgroundColor,
            borderRadius: "0 0 0.5em 0.5em",
            paddingLeft: "1em",
          }}
          alignItems={"center"}
          direction={"row"}
          spacing={1}
        >
          <Box
            flexGrow={1}
            sx={{
              height: "0.25em",
              minWidth: isActive ? "100ch" : undefined,
              backgroundColor: isActive
                ? Colors.from("blue").lighten(0.5).toString()
                : Colors.from("black").alpha(0).toString(),
            }}
          />
          <Box
            sx={{
              backgroundColor,
              borderRadius: "0.5em",
              paddingTop: "0.5em",
            }}
          >
            <Tooltip title={"Extra Context"}>
              <IconButton
                sx={{
                  padding: "0.1em",
                }}
                onClick={() => {
                  setOpenNote(true);
                }}
              >
                <NoteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Tooltip>
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
