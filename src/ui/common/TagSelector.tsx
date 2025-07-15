

import { Button } from "@mui/material";
import { Stack } from "@mui/system";

export const TagSelector = ({
  allTags = [],
  selected = [],
  narrowTags = [],
  onChange,
}: {
  allTags: string[];
  narrowTags?: string[];
  selected: string[];
  onChange?: (newSelected: string[]) => void;
}) => {
  return (
    <Stack direction={"row"} flexWrap={"wrap"}>
      {allTags.toSorted().map((tag, index) => (
        <Button
          key={index}
          variant={selected.includes(tag) ? "contained" : "outlined"}
          color={narrowTags?.includes(tag) ? "primary" : "secondary"}
          size="small"
          // sx={{
          //   minWidth: 80,
          //   padding: "6px 16px",
          //   boxSizing: "border-box",
          // }}
          disableElevation
          sx={{ boxShadow: "none" }}
          onClick={() => {
            if (selected.includes(tag)) {
              selected = selected.filter((t) => t !== tag);
            } else {
              selected = [...selected, tag];
            }
            onChange?.(selected);
          }}
        >
          {tag}
        </Button>
      ))}
    </Stack>
  );
};
