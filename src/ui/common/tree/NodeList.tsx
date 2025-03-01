import { Divider, List, Box } from "@mui/material";
import React from "react";
import { NodeItem } from "./NodeItem";
import { NoteItem } from "./NoteItem";

export const NodeList: React.FC<{
  children: any[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
  handleDelete: (nodeId: string) => void;
  isNoteSelected: boolean;
  handleSelectNote: () => void;
  noteContent: React.ReactNode;
  currentParentId: string;
}> = ({
  children,
  selectedChildId,
  setSelectedChildId,
  hoveredId,
  setHoveredId,
  onOpenEditor,
  handleDelete,
  isNoteSelected,
  handleSelectNote,
  noteContent,
  currentParentId,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      overflow: "hidden",
    }}
  >
    <List
      sx={{
        bgcolor: "background.paper",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      {children.map((child) => (
        <NodeItem
          key={child.id}
          child={child}
          selectedChildId={selectedChildId}
          setSelectedChildId={setSelectedChildId}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          onOpenEditor={onOpenEditor}
          handleDelete={handleDelete}
        />
      ))}
      {children.length > 0 && <Divider component="li" />}
    </List>
    <NoteItem
      isNoteSelected={isNoteSelected}
      handleSelectNote={handleSelectNote}
      noteContent={noteContent}
      currentParentId={currentParentId}
      hoveredId={hoveredId}
      setHoveredId={setHoveredId}
    />
  </Box>
);