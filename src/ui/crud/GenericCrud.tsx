import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  Toolbar,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// A generic schema that (for each property K in T) optionally defines:
// 1) a label (e.g. column header or field label),
// 2) a custom cell renderer for table display,
// 3) a custom editor for the dialog form.

export type CrudSchema<T extends object = {}> = {
  [K in keyof T]?: {
    label?: string;
    renderCell?: (value: T[K], item: T) => React.ReactNode;
    renderEditor?: (
      value: T[K],
      onChange: (newValue: T[K]) => void,
      item: T
    ) => React.ReactNode;
  };
};

export function GenericCrud<T extends object>({
  items,
  schema,
  onUpdate,
  onCreate,
  onDelete,
}: {
  items: T[];
  schema: CrudSchema<T>;
  onUpdate?: (newItem: T, index: number) => void;
  onCreate?: (newItem: T) => void;
  onDelete?: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<T>>({});

  // Open the dialog for the given item index
  const handleRowClick = (index: number) => {
    setSelectedIndex(index);
    setDraft(items[index]);
    setOpen(true);
  };

  // Open the dialog for creating a new item
  const handleAddClick = () => {
    setSelectedIndex(null);
    setDraft({});
    setOpen(true);
  };

  // Called when the user types/changes a form field
  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // If the user confirms the dialog
  const handleSave = () => {
    if (selectedIndex == null) {
      if (onCreate) {
        onCreate(draft as T);
      }
    } else if (onUpdate) {
      onUpdate(draft as T, selectedIndex);
    }
    setOpen(false);
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (index: number) => {
    setSelectedIndex(index);
    setDeleteOpen(true);
  };

  // Confirm deletion
  const handleDeleteConfirm = () => {
    if (selectedIndex !== null && onDelete) {
      onDelete(selectedIndex);
    }
    setDeleteOpen(false);
  };

  // Render a generic table cell
  const renderTableCell = (key: keyof T, item: T) => {
    const value = item[key];
    const fieldSchema = schema[key];
    if (fieldSchema?.renderCell) {
      return fieldSchema.renderCell(value, item);
    }
    // If no custom renderer, just display the raw value
    return String(value);
  };

  // Render a generic editor for the dialog
  const renderEditor = (key: keyof T, item: T) => {
    const value = draft[key];
    const fieldSchema = schema[key];

    if (fieldSchema?.renderEditor) {
      return fieldSchema.renderEditor(
        value!,
        (v) => handleChange(key, v),
        draft as T
      );
    }

    // Basic fallback editors by type:
    if (typeof value === "boolean") {
      return (
        <Checkbox
          checked={value}
          onChange={(e) => handleChange(key, e.target.checked as T[typeof key])}
        />
      );
    } else if (typeof value === "number") {
      return (
        <TextField
          type="number"
          fullWidth
          value={value}
          onChange={(e) =>
            handleChange(key, parseFloat(e.target.value) as T[typeof key])
          }
        />
      );
    } else if (value instanceof Date) {
      // Minimal date editing example (HTML date input).
      return (
        <TextField
          type="date"
          fullWidth
          // Convert to yyyy-MM-dd
          value={(value as Date).toISOString().substring(0, 10)}
          onChange={(e) =>
            handleChange(key, new Date(e.target.value) as T[typeof key])
          }
        />
      );
    } else {
      // Default to a text field
      return (
        <TextField
          type="text"
          fullWidth
          value={(value ?? "") as string}
          onChange={(e) => handleChange(key, e.target.value as T[typeof key])}
        />
      );
    }
  };

  // Column keys in stable order:
  const columns = Object.keys(schema) as (keyof T)[];

  return (
    <>
      <Toolbar>
        <IconButton color="primary" onClick={handleAddClick}>
          <AddIcon />
        </IconButton>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((key) => (
              <TableCell key={String(key)}>
                {schema[key]?.label ?? String(key)}
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              hover
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(rowIndex)}
            >
              {columns.map((key) => (
                <TableCell key={String(key)}>
                  {renderTableCell(key, item)}
                </TableCell>
              ))}
              <TableCell>
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(rowIndex);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Dialog for editing the selected item */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        disableRestoreFocus
      >
        <DialogTitle>
          {selectedIndex == null ? "Add Item" : "Edit Item"}
        </DialogTitle>
        <DialogContent dividers>
          {columns.map((key) => (
            <div key={String(key)} style={{ marginBottom: 16 }}>
              <strong>{schema[key]?.label ?? String(key)}:</strong>
              <div style={{ marginTop: 8 }}>
                {renderEditor(key, draft as T)}
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for deletion */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
        closeAfterTransition={false}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
