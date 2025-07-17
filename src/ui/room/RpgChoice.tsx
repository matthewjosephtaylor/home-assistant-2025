import {
  Button,
  Stack,
  Typography,
  type ButtonProps,
} from "@mui/material";

export type RpgChoice = {
  action: string;
  why: string;
  successChanceOutOf100: number;
  relevantStats?: string[];
};

export const RpgChoiceSelect = ({
  choices,
  onSelect,
  buttonProps,
}: {
  choices: RpgChoice[];
  onSelect: (choice: RpgChoice, index: number) => void;
  buttonProps?: ButtonProps;
}) => {
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {choices.map((choice, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => onSelect(choice, index)}
          {...buttonProps}
          sx={{ textAlign: "left", maxWidth: 250 }}
        >
          <Stack spacing={0.5}>
            <Typography fontWeight="bold" variant="body1">
              {choice.action}
            </Typography>
            <Typography variant="body2">
              {choice.why} ({choice.successChanceOutOf100}% success)
            </Typography>
            {choice.relevantStats?.length ? (
              <Typography variant="caption" color="text.secondary">
                Stats: {choice.relevantStats.join(", ")}
              </Typography>
            ) : null}
          </Stack>
        </Button>
      ))}
    </Stack>
  );
};
