import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton } from "@mui/material";

export const NodeItemButtons = ({
  childId,
  onOpenEditor,
  handleDelete,
  visible,
}: {
  childId: string;
  onOpenEditor: (params: {
    parentId?: string;
    nodeId?: string;
    mode: "add" | "edit";
  }) => void;
  handleDelete: (nodeId: string) => void;
  visible: boolean;
}) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ visibility: visible ? "visible" : "hidden", ml: 1 }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onOpenEditor({ nodeId: childId, mode: "edit" });
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onOpenEditor({ parentId: childId, mode: "add" });
        }}
      >
        <AddCircleIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(childId);
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
