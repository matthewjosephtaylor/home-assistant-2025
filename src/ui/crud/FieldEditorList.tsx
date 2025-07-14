import { Stack, StackProps } from "@mui/material";
import { FieldEditor } from "./FieldEditor"; // assuming this is memoized already
import { CrudSchema } from "./GenericCrud";

export function FieldEditorList<T extends object>({
  columns,
  draft,
  schema,
  onChange,
  ...stackProps
}: Omit<StackProps, "onChange"> & {
  columns: (keyof T)[];
  draft: T;
  schema: CrudSchema<T>;
  onChange: (key: keyof T, value: T[keyof T]) => void;
}) {
  return (
    <Stack spacing={2} direction="column" {...stackProps}>
      {columns.map((key) => (
        <FieldEditor
          key={String(key)}
          keyName={key}
          value={draft[key]}
          schema={schema}
          draft={draft}
          onChange={onChange}
        />
      ))}
    </Stack>
  );
}
