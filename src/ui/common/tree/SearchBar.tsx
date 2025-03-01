import { TextField } from "@mui/material";
import type React from "react";

export const SearchBar: React.FC<{
  search: string;
  setSearch: (value: string) => void;
}> = ({ search, setSearch }) => (
  <TextField
    variant="outlined"
    size="small"
    label="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    fullWidth
    sx={{ mb: 2 }}
  />
);
