import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormLabel,
  FormHelperText,
  Stack,
  useTheme,
} from "@mui/material";

export function CheckboxWithLabel({
  label,
  helperText,
  error,
  required,
  ...checkboxProps
}: {
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
} & CheckboxProps) {
  const theme = useTheme();
  return (
    <FormControl required={required} error={error} component="fieldset">
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1.5),
        }}
      >
        {label && <FormLabel>{label}</FormLabel>}
        <Checkbox {...checkboxProps} />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </Stack>
    </FormControl>
  );
}
