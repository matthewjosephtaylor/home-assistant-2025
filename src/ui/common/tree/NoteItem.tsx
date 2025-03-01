import { ListItemButton, ListItemText } from "@mui/material";
import React from "react";

export const NoteItem: React.FC<{
  isNoteSelected: boolean;
  handleSelectNote: () => void;
  noteContent: React.ReactNode;
  currentParentId: string;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}> = ({
  isNoteSelected,
  handleSelectNote,
  noteContent,
  currentParentId,
  hoveredId,
  setHoveredId,
}) => (
  <ListItemButton
    selected={isNoteSelected}
    onClick={handleSelectNote}
    onMouseEnter={() => setHoveredId("NOTE-" + currentParentId)}
    onMouseLeave={() => setHoveredId(null)}
  >
    <ListItemText primary={noteContent} />
  </ListItemButton>
);
