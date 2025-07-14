import { Box, TextField } from "@mui/material";
import { CheckboxWithLabel } from "../common/CheckboxWithLabel";
import { StringArrayEditor } from "../common/StringArrayEditor";
import { useMemo } from "react";
import { CrudSchema } from "./GenericCrud";

export const FieldEditor = <T extends object>({
  keyName,
  value,
  schema,
  onChange,
  draft,
}: {
  keyName: keyof T;
  value?: T[keyof T];
  schema: CrudSchema<T>;
  onChange: (key: keyof T, value: T[keyof T]) => void;
  draft: T;
}) => {
  const fieldSchema = schema[keyName];

  const editor = useMemo(() => {
    if (fieldSchema?.renderEditor) {
      return fieldSchema.renderEditor(
        value!,
        (v) => onChange(keyName, v),
        draft
      );
    }

    if (typeof value === "boolean") {
      return (
        <CheckboxWithLabel
          checked={value}
          label={fieldSchema?.label ?? String(keyName)}
          onChange={(value) => onChange(keyName, value as T[typeof keyName])}
        />
      );
    } else if (typeof value === "number") {
      return (
        <TextField
          type="number"
          fullWidth
          label={fieldSchema?.label ?? String(keyName)}
          value={value}
          onChange={(e) =>
            onChange(keyName, parseFloat(e.target.value) as T[typeof keyName])
          }
        />
      );
    } else if (Array.isArray(value)) {
      return (
        <StringArrayEditor
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          alignItems="flex-start"
          sx={{ width: "fit-content" }}
          value={value}
          label={fieldSchema?.label ?? String(keyName)}
          onChange={(newValue) => {
            onChange(keyName, newValue as T[typeof keyName]);
          }}
        />
      );
    } else if (value instanceof Date) {
      return (
        <TextField
          type="date"
          fullWidth
          label={fieldSchema?.label ?? String(keyName)}
          value={value.toISOString().substring(0, 10)}
          onChange={(e) =>
            onChange(keyName, new Date(e.target.value) as T[typeof keyName])
          }
        />
      );
    } else {
      return (
        <TextField
          type="text"
          fullWidth
          multiline
          label={fieldSchema?.label ?? String(keyName)}
          value={(value ?? "") as string}
          onChange={(e) =>
            onChange(keyName, e.target.value as T[typeof keyName])
          }
        />
      );
    }
  }, [keyName, value, fieldSchema, draft]);

  return <Box key={String(keyName)}>{editor}</Box>;
};
