import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useState } from "react";

type JsonValue = null | boolean | number | string | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

export function JsonEditor({
  initialValue,
  onSave,
}: {
  initialValue: unknown;
  onSave: (updated: JsonValue) => void;
}) {
  const [value, setValue] = useState<JsonValue>(() =>
    typeof initialValue === "object" && initialValue !== null
      ? JSON.parse(JSON.stringify(initialValue)) // deep clone
      : initialValue as JsonValue
  );

  return (
    <Stack spacing={2}>
      <JsonValueEditor value={value} onChange={setValue} />
      <Button variant="contained" onClick={() => onSave(value)}>
        Save
      </Button>
    </Stack>
  );
}

function JsonValueEditor({
  value,
  onChange,
}: {
  value: JsonValue;
  onChange: (val: JsonValue) => void;
}) {
  if (Array.isArray(value)) {
    return (
      <Stack spacing={1} pl={2}>
        <Typography variant="subtitle2">Array</Typography>
        {value.map((v, idx) => (
          <Stack direction="row" alignItems="center" key={idx} spacing={1}>
            <JsonValueEditor
              value={v}
              onChange={(newVal) => {
                const updated = [...value];
                updated[idx] = newVal;
                onChange(updated);
              }}
            />
            <IconButton
              onClick={() => {
                const updated = [...value];
                updated.splice(idx, 1);
                onChange(updated);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Button
          startIcon={<Add />}
          size="small"
          onClick={() => onChange([...value, null])}
        >
          Add item
        </Button>
      </Stack>
    );
  } else if (typeof value === "object" && value !== null) {
    return (
      <Stack spacing={1} pl={2}>
        <Typography variant="subtitle2">Object</Typography>
        {Object.entries(value).map(([key, val]) => (
          <Stack key={key} direction="row" alignItems="center" spacing={1}>
            <TextField
              size="small"
              value={key}
              onChange={(e) => {
                const newKey = e.target.value;
                const { [key]: oldVal, ...rest } = value;
                onChange({ ...rest, [newKey]: oldVal });
              }}
              sx={{ width: 120 }}
            />
            <JsonValueEditor
              value={val}
              onChange={(newVal) => {
                onChange({ ...value, [key]: newVal });
              }}
            />
            <IconButton
              onClick={() => {
                const { [key]: _, ...rest } = value;
                onChange(rest);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Button
          startIcon={<Add />}
          size="small"
          onClick={() =>
            onChange({ ...value, [`key${Object.keys(value).length}`]: null })
          }
        >
          Add property
        </Button>
      </Stack>
    );
  } else {
    return (
      <PrimitiveEditor value={value} onChange={onChange} />
    );
  }
}

function PrimitiveEditor({
  value,
  onChange,
}: {
  value: string | number | boolean | null;
  onChange: (val: JsonValue) => void;
}) {
  const getType = (): string => {
    if (value === null) return "null";
    return typeof value;
  };

  const type = getType();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={type}
          label="Type"
          onChange={(e) => {
            const newType = e.target.value;
            switch (newType) {
              case "string":
                onChange("");
                break;
              case "number":
                onChange(0);
                break;
              case "boolean":
                onChange(false);
                break;
              case "null":
                onChange(null);
                break;
            }
          }}
        >
          <MenuItem value="string">string</MenuItem>
          <MenuItem value="number">number</MenuItem>
          <MenuItem value="boolean">boolean</MenuItem>
          <MenuItem value="null">null</MenuItem>
        </Select>
      </FormControl>

      {type === "string" && (
        <TextField
          size="small"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {type === "number" && (
        <TextField
          type="number"
          size="small"
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}
      {type === "boolean" && (
        <Select
          size="small"
          value={value ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}
        >
          <MenuItem value="true">true</MenuItem>
          <MenuItem value="false">false</MenuItem>
        </Select>
      )}
      {type === "null" && <Typography fontStyle="italic">null</Typography>}
    </Stack>
  );
}
