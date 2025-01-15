import { Idbs } from "@mjt-engine/idb";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AppConfig } from "../AppConfig";

export const ConfigButton = () => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    Idbs.get(AppConfig, "config").then((config) => {
      setToken(config?.authToken || "");
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
    Idbs.update(AppConfig, "config", (config) => ({
      ...config,
      authToken: token,
    }));
  };

  return (
    <>
      <Button onClick={handleClickOpen}>Config</Button>
      <Dialog open={open} onClose={handleSave}>
        <DialogTitle>Configuration</DialogTitle>
        <DialogContent style={{ paddingTop: "20px" }}>
          <TextField
            label="Auth Token"
            type="password"
            fullWidth
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
