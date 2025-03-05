import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({
  onChange,
  renderFile,
  placeholder,
}: {
  onChange?: (file?: File) => void;
  renderFile?: (file: File) => ReactNode;
  placeholder?: ReactNode;
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFile = acceptedFiles[0];
      setFile(newFile);
      onChange?.(newFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        position: "relative",
        width: 200,
        height: 200,
        border: "2px dashed gray",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      <input {...getInputProps()} />

      {file ? (
        <>
          {renderFile?.(file)}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setFile(undefined);
              onChange?.(undefined);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
            }}
          >
            <EditIcon />
          </IconButton>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "gray",
          }}
        >
          {placeholder || <CloudUploadIcon fontSize="large" />}
          <Typography variant="body2">
            Drag & drop or click to upload
          </Typography>
        </Box>
      )}
    </Box>
  );
};
