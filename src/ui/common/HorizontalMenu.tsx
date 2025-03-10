import React from "react";
import { Box, Button, Stack } from "@mui/material";

interface TopMenuProps {
  actions: Record<string, () => void>;
}

export const HorizontalMenu: React.FC<TopMenuProps> = ({ actions }) => {
  return (
    <Box
      component="nav"
      sx={{ padding: 2, backgroundColor: "background.paper", boxShadow: 1 }}
    >
      <Stack direction="row" spacing={2}>
        {Object.entries(actions).map(([label, action]) => (
          <Button
            key={label}
            onClick={action}
            variant="text"
            sx={{ color: "text.primary" }}
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
