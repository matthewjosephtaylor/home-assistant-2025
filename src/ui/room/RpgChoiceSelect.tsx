import {
  Button,
  Stack,
  StackProps,
  Typography,
  type ButtonProps,
} from "@mui/material";

export type RpgChoice = {
  action: string;
  why: string;
  pickChanceOutOf100: number;
  relevantStats?: string[];
};

export const RpgChoiceSelect = ({
  choices,
  onSelect,
  buttonProps,
  ...rest
}: Omit<StackProps, "onSelect"> & {
  choices: RpgChoice[];
  onSelect: (choice: RpgChoice, index: number) => void;
  buttonProps?: ButtonProps;
}) => {
  if (!Array.isArray(choices)) {
    return <></>;
  }
  return (
    <Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      alignItems={"flex-start"}
      {...rest}
    >
      {choices.map((choice, index) => (
        <Button
          key={index}
          variant="outlined"
          color={getMuiColorForChance(choice.pickChanceOutOf100)}
          onClick={() => onSelect(choice, index)}
          {...buttonProps}
          sx={{ textAlign: "left", maxWidth: "20ch", ...buttonProps?.sx }}
        >
          <Stack spacing={0.5}>
            <Typography fontWeight="bold" variant="body1">
              {choice.action}
            </Typography>
            <Typography variant="caption">{choice.why}</Typography>
            <Stack sx={{ borderLeft: "1px solid", paddingLeft: "0.5em" }}>
              {choice.pickChanceOutOf100}% success
              {choice.relevantStats?.length ? (
                <Typography variant="caption" color="textSecondary">
                  {choice.relevantStats.join(", ")}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
};

export function getMuiColorForChance(
  chance: number
): "error" | "warning" | "info" | "success" {
  if (chance < 25) return "error";
  if (chance < 50) return "warning";
  if (chance < 75) return "info";
  return "success";
}
