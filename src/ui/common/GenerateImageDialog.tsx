import { isDefined, isUndefined } from "@mjt-engine/object";
import {
  CONTENT_OBJECT_STORE,
  type Content,
} from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import type { TextToImageRequest } from "@mjt-services/imagegen-common-2025";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { getConnection } from "../../connection/Connections";
import { ContentImage } from "../content/ContentImage";
import { ContentView } from "../content/ContentView";
import { FileUpload } from "./FileUpload";

export const GenerateImageDialog = ({
  open,
  value,
  onClose,
  onSave,
  title = "Generate Image",
}: {
  open: boolean;
  value?: Content;
  onClose: () => void;
  onSave: (value: Content) => void;
  title?: string;
}) => {
  console.log("GenerateImageDialog value", value);
  const [localValue, setLocalValue] = useState(value);
  const [request, setRequest] = useState<Partial<TextToImageRequest>>({
    steps: 10,
    width: 512,
    height: 512,
    cfg_scale: 7,
    ...(value?.source ?? {}),
  });
  const handleSave = () => {
    const updatedContent = {
      ...(localValue ?? {
        id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
        createdAt: Date.now(),
      }),
      contentType: "image/png",
      value: localValue?.value ?? "",
      updatedAt: Date.now(),
      alternatives: [...(localValue?.alternatives ?? []), value].filter(
        isDefined
      ),
    } satisfies Content;
    onSave(updatedContent);
    onClose();
  };
  useEffect(() => {
    setLocalValue(value); // reset localValue when value changes
    setRequest({
      steps: 10,
      width: 512,
      height: 512,
      cfg_scale: 7,
      ...(value?.source ?? {}),
    });
  }, [value]);
  const generate = async () => {
    const con = await getConnection();

    con.requestMany({
      onResponse: (response) => {
        const updatedContent = {
          ...(localValue ?? {
            id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
            createdAt: Date.now(),
          }),
          contentType: "image/png",
          value: response.images[0],
          updatedAt: Date.now(),
          source: request,
        } satisfies Content;
        setLocalValue(updatedContent);
      },
      subject: "imagegen.txt2img",
      request: {
        body: {
          prompt: request.prompt ?? "",
          ...request,
        },
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack gap={2}>
          <Stack direction={"row"} spacing={2}>
            <FileUpload
              onChange={async function (file): Promise<void> {
                if (isUndefined(file)) {
                  return;
                }
                const arrayBuffer = await file.arrayBuffer();
                const updatedContent = {
                  ...(localValue ?? {
                    id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
                    createdAt: Date.now(),
                  }),
                  contentType: "image/png",
                  value: arrayBuffer,
                  updatedAt: Date.now(),
                } satisfies Content;
                setLocalValue(updatedContent);
              }}
              renderFile={function (file: File): ReactNode {
                return (
                  <ContentView
                    contentType="image/png"
                    contentId={localValue?.id}
                    imgProps={{ style: { maxHeight: "8em" } }}
                  />
                );
              }}
            />
            <ContentImage content={localValue} style={{ maxHeight: "20em" }} />
          </Stack>
          <TextField
            label="Prompt"
            value={request.prompt}
            onChange={(e) =>
              setRequest((cur) => ({ ...cur, prompt: e.target.value }))
            }
            fullWidth
            multiline
            variant="outlined"
            placeholder="Enter prompt here..."
          />
          <Box
            component={"form"}
            noValidate
            sx={{
              display: "grid",
              gridTemplateColumns: { sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Width"
              value={request.width}
              onChange={(e) =>
                setRequest((cur) => ({
                  ...cur,
                  width: parseInt(e.target.value),
                }))
              }
              variant="outlined"
              type="number"
            />
            <TextField
              label="Height"
              value={request.height}
              onChange={(e) =>
                setRequest((cur) => ({
                  ...cur,
                  height: parseInt(e.target.value),
                }))
              }
              variant="outlined"
              type="number"
            />
            <TextField
              label="Steps"
              value={request.steps}
              onChange={(e) =>
                setRequest((cur) => ({
                  ...cur,
                  steps: parseInt(e.target.value),
                }))
              }
              variant="outlined"
              type="number"
            />
            <TextField
              label="Cfg Scale"
              value={request.cfg_scale}
              onChange={(e) =>
                setRequest((cur) => ({
                  ...cur,
                  cfg_scale: parseInt(e.target.value),
                }))
              }
              variant="outlined"
              type="number"
            />
          </Box>
          <Button
            onClick={() => {
              generate();
            }}
          >
            Generate
          </Button>
        </Stack>
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
