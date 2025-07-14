import React, { useState, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, BoxProps } from "@mui/system";

export type ContextMenuActions = Record<string, (() => void) | ContextMenuItem>;

export type ContextMenuItem = Partial<{
  label: string;
  icon: React.ReactNode;
  action: () => void;
}>;

export const ContextMenu = ({
  actions,
  children,
  ...rest
}: BoxProps & {
  actions: ContextMenuActions;
  children: React.ReactNode;
}) => {
  const [menuPosition, setMenuPosition] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMenuPosition({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  return (
    <Box
      onContextMenu={handleContextMenu}
      style={{ cursor: "context-menu" }}
      {...rest}
    >
      {children}
      <Menu
        sx={{ borderRadius: "1em" }}
        open={menuPosition !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
        PaperProps={{ elevation: 3, sx: { borderRadius: 2 } }}
      >
        {Object.entries(actions).map(([label, item]) => (
          <MenuItem
            key={label}
            onClick={(evt) => {
              evt.stopPropagation();
              if (typeof item === "function") {
                item();
              } else if (item?.action) {
                item.action();
              }
              handleClose();
            }}
          >
            <ListItemText
              sx={{ fontSize: "0.1rem" }}
              primary={
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  {typeof item !== "function" ? (item.label ?? label) : label}
                </Typography>
              }
            />
            {typeof item !== "function" && item?.icon && (
              <ListItemIcon sx={{ marginLeft: "3em" }}>
                {item.icon}
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
