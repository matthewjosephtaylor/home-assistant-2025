import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";

export const TextDialog = ({
  open,
  value,
  onClose,
  onSave,
  title = "Edit Text",
}: {
  open: boolean;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
  title?: string;
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleSave = () => {
    onSave(localValue);
    onClose();
  };
  useEffect(() => {
    setLocalValue(value); // reset localValue when value changes
  }, [value]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <TextField
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          fullWidth
          multiline
          variant="outlined"
          placeholder="Enter text here..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
