import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { CrudSchemaValueEditor } from "./CrudSchemaValueEditor";
import { CrudSchema } from "./GenericCrud";

export const CrudSchemaDialog = <T extends object>({
  title,
  value,
  schema,
  onSave,
  setOpen,
  ...rest
}: {
  title?: string;
  value: Partial<T>;
  schema: CrudSchema<Partial<T>>;
  onSave?: (value: Partial<T>) => void;
  setOpen?: (open: boolean) => void;
} & DialogProps) => {
  // Column keys in stable order:
  const [columns, setColumns] = useState<(keyof T)[]>([]);
  const [draft, setDraft] = useState<Partial<T>>();

  useEffect(() => {
    setColumns(Object.keys(schema) as (keyof T)[]);
  }, [schema]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <Dialog
      onClose={() => setOpen?.(false)}
      fullWidth
      maxWidth="sm"
      disableRestoreFocus
      slotProps={{ paper: { sx: { width: "80vw", maxWidth: "none" } } }}
      {...rest}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} direction="column">
          {columns.map((key) => (
            <CrudSchemaValueEditor
              draftKey={key}
              key={String(key)}
              draft={draft as T}
              schema={schema as CrudSchema<T>}
              onChange={handleChange}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen?.(false)}>Cancel</Button>
        <Button
          onClick={() => onSave?.(draft as T)}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
