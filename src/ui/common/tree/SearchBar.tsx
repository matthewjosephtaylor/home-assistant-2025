import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBar = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => (
  <TextField
    variant="outlined"
    size="small"
    label="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    fullWidth
    // InputProps={{
    //   endAdornment: (
    //     <InputAdornment position="end">
    //       <IconButton>
    //         <SearchIcon />
    //       </IconButton>
    //     </InputAdornment>
    //   ),
    // }}
    sx={{
      marginTop: "1.8em",
      "& .MuiOutlinedInput-root": {
        borderRadius: "0.5em 0.5em 0 0", // Rounded top corners only
      },
    }}
  />
);
