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
import { ContentImage } from "../content/ContentImage";
import { ContentView } from "../content/ContentView";
import { FileUpload } from "./FileUpload";
import { AlternativePicker } from "./AlternativePicker";
import { useAppState } from "../../state/AppState";
import { generateImage } from "../../image/generateImage";

export const DEFAULT_IMAGEGEN_REQUEST: Partial<TextToImageRequest> = {
  steps: 10,
  width: 512,
  height: 512,
  cfg_scale: 7,
};

export const GenerateImageDialog = ({
  open,
  value,
  onClose,
  onSave,
  title = "Generate Image",
  defaultRequest = DEFAULT_IMAGEGEN_REQUEST,
}: {
  open: boolean;
  value?: Content;
  onClose: () => void;
  onSave: (value: Content) => void;
  title?: string;
  defaultRequest?: Partial<TextToImageRequest>;
}) => {
  const { abortController } = useAppState();
  const [localValue, setLocalValue] = useState(value);
  const [request, setRequest] = useState<Partial<TextToImageRequest>>({
    ...DEFAULT_IMAGEGEN_REQUEST,
    ...defaultRequest,
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
      ...DEFAULT_IMAGEGEN_REQUEST,
      ...defaultRequest,
      ...(value?.source ?? {}),
    });
  }, [value, defaultRequest]);

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

                console.log("updatedContent", updatedContent);
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
            <ContentImage
              onAbort={() => {
                console.log("aborting");
                abortController?.abort();
              }}
              content={localValue}
              style={{ height: "20em" }}
            />
          </Stack>
          <AlternativePicker
            onRemove={(index) => {
              if (isUndefined(localValue)) {
                return;
              }
              const updatedContent = {
                ...localValue,
                updatedAt: Date.now(),
                alternatives: (localValue?.alternatives ?? []).filter(
                  (_, i) => i !== index
                ),
              } satisfies Content;
              setLocalValue(updatedContent);
            }}
            onPick={(alt) => {
              if (isUndefined(localValue)) {
                return;
              }
              const updatedContent = {
                ...localValue,
                contentType: alt.contentType,
                value: alt.value,
                updatedAt: Date.now(),
                alternatives: [
                  ...(localValue?.alternatives ?? []).filter(
                    (a) => a.updatedAt !== alt.updatedAt
                  ),
                  { ...localValue, alternatives: [] },
                ].filter(isDefined),
              } satisfies Content;
              setLocalValue(updatedContent);
              if (isDefined(alt.source)) {
                setRequest(alt.source);
              }
            }}
            content={localValue}
            sx={{
              // maxHeight: "20em",
              maxWidth: "100%",
              overflow: "auto",
            }}
            direction={"row"}
            spacing={"0.5em"}
          />
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
          <TextField
            label="Negative Prompt"
            color="secondary"
            value={request.negative_prompt}
            onChange={(e) =>
              setRequest((cur) => ({ ...cur, negative_prompt: e.target.value }))
            }
            fullWidth
            multiline
            variant="outlined"
            placeholder="Enter negative prompt here..."
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
              generateImage({
                draft: localValue,
                request,
                onUpdate: (content) => {
                  setLocalValue(content);
                },
              });
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
