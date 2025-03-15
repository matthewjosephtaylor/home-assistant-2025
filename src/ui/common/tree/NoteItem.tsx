import { Box, ListItemButton, ListItemText } from "@mui/material";
import React from "react";

export const NoteItem = ({
  selected,
  onClick,
  value,
  ...rest
}: {
  value: React.ReactNode;
} & Parameters<typeof ListItemButton>[0]) => (
  <Box onClick={onClick}>{value}</Box>
  // <ListItemButton selected={selected} onClick={onClick} {...rest}>
  //   <ListItemText primary={value} />
  // </ListItemButton>
);
