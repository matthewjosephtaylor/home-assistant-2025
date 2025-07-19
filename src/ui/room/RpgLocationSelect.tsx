import {
  Button,
  Stack,
  StackProps,
  Typography,
  type ButtonProps,
} from "@mui/material";

export type RpgLocation = {
  name: string;
  travelTimeMinutes: number;
  description?: string;
};

export const RpgLocationSelect = ({
  choices,
  onSelect,
  buttonProps,
  ...rest
}: Omit<StackProps, "onSelect"> & {
  choices: RpgLocation[];
  onSelect: (choice: RpgLocation, index: number) => void;
  buttonProps?: ButtonProps;
}) => {
  if (!Array.isArray(choices)) return null;

  return (
    <Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      alignItems="flex-start"
      {...rest}
    >
      {choices.map((choice, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => onSelect(choice, index)}
          {...buttonProps}
          sx={{ textAlign: "left", maxWidth: "20ch", ...buttonProps?.sx }}
        >
          <Stack spacing={0.5}>
            <Typography fontWeight="bold" variant="body1">
              {choice.name}
            </Typography>
            {choice.description && (
              <Typography variant="caption">{choice.description}</Typography>
            )}
            <Typography variant="caption" color="textSecondary">
              {choice.travelTimeMinutes} min travel
            </Typography>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
};
