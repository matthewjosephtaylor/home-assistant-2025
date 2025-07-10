import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
  StackProps,
  TextField,
  useTheme,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export function StringArrayEditor({
  label,
  helperText,
  value,
  onChange,
  placeholder,
  error,
  required,
  ...rest
}: StackProps & {
  label?: string;
  helperText?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: boolean;
  required?: boolean;
}) {
  const theme = useTheme();

  const handleChange = (index: number, val: string) => {
    const next = [...value];
    next[index] = val;
    onChange(next);
  };

  const handleDelete = (index: number) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...value, ""]);
  };

  return (
    <FormControl fullWidth required={required} error={error}>
      <Box sx={{ position: "relative", mt: 3 }}>
        {label && (
          <FormLabel
            sx={{
              position: "absolute",
              top: "-1em",
              left: "2ch",
              fontSize: "0.75rem",
            }}
          >
            {label}
          </FormLabel>
        )}

        <Box
          sx={{
            border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1.5),
          }}
        >
          <Stack spacing={1} {...rest}>
            {value.map((val, idx) => (
              <Stack direction="row" spacing={1} key={idx} alignItems="center">
                <TextField
                  fullWidth
                  value={val}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  size="small"
                  variant="outlined"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleDelete(idx)}
                            edge="end"
                            aria-label="Remove"
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            ))}
            <Button onClick={handleAdd} startIcon={<Add />} size="small">
              Add {label}
            </Button>
          </Stack>
        </Box>
      </Box>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
