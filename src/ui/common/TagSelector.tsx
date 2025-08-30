import { Button } from "@mui/material";
import { Stack, StackProps } from "@mui/system";

export const TagSelector = ({
  allTags = [],
  selected = [],
  narrowTags = [],
  onChange,
  ...rest
}: Omit<StackProps, "onChange"> & {
  allTags: string[];
  narrowTags?: string[];
  selected: string[];
  onChange?: (newSelected: string[]) => void;
}) => {
  return (
    <Stack direction={"row"} flexWrap={"wrap"} {...rest}>
      {allTags.map((tag, index) => (
        <Button
          key={index}
          variant={selected.includes(tag) ? "contained" : "outlined"}
          color={narrowTags?.includes(tag) ? "primary" : "secondary"}
          size="small"
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
