import { TextField } from "@mui/material";
import { CheckboxWithLabel } from "../common/CheckboxWithLabel";
import { StringArrayEditor } from "../common/StringArrayEditor";
import { CrudSchema } from "./GenericCrud";

export const CrudSchemaValueEditor = <T extends object>({
  draftKey,
  draft,
  schema,
  onChange: onChange,
}: {
  draftKey: keyof T;
  draft: T;
  schema: CrudSchema<T>;
  onChange: (key: keyof T, value: T[keyof T]) => void;
}) => {
  const value = draft[draftKey];
  const fieldSchema = schema[draftKey];

  if (fieldSchema?.renderEditor) {
    return fieldSchema.renderEditor(
      value!,
      (v) => onChange(draftKey, v),
      draft as T
    );
  }

  // Basic fallback editors by type:
  if (typeof value === "boolean") {
    return (
      <CheckboxWithLabel
        checked={value}
        label={fieldSchema?.label ?? String(draftKey)}
        onChange={(value) => onChange(draftKey, value as T[typeof draftKey])}
      />
    );
  } else if (typeof value === "number") {
    return (
      <TextField
        type="number"
        fullWidth
        label={fieldSchema?.label ?? String(draftKey)}
        value={value}
        onChange={(e) =>
          onChange(draftKey, parseFloat(e.target.value) as T[typeof draftKey])
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
        label={fieldSchema?.label ?? String(draftKey)}
        onChange={(newValue) => {
          onChange(draftKey, newValue as T[typeof draftKey]);
        }}
      />
    );
  } else if (value instanceof Date) {
    // Minimal date editing example (HTML date input).
    return (
      <TextField
        type="date"
        fullWidth
        label={fieldSchema?.label ?? String(draftKey)}
        // Convert to yyyy-MM-dd
        value={(value as Date).toISOString().substring(0, 10)}
        onChange={(e) =>
          onChange(draftKey, new Date(e.target.value) as T[typeof draftKey])
        }
      />
    );
  } else {
    // Default to a text field
    return (
      <TextField
        type="text"
        fullWidth
        multiline
        label={fieldSchema?.label ?? String(draftKey)}
        value={(value ?? "") as string}
        onChange={(e) =>
          onChange(draftKey, e.target.value as T[typeof draftKey])
        }
      />
    );
  }
};
