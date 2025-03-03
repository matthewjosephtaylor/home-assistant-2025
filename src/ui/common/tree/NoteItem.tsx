import { ListItemButton, ListItemText } from "@mui/material";
import React from "react";

export const NoteItem = ({
  selected,
  onClick,
  value,
  ...rest
}: {
  value: React.ReactNode;
} & Parameters<typeof ListItemButton>[0]) => (
  <ListItemButton selected={selected} onClick={onClick} {...rest}>
    <ListItemText primary={value} />
  </ListItemButton>
);
