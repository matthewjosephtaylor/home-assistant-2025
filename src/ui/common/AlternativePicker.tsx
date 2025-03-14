import { isUndefined } from "@mjt-engine/object";
import { type Content } from "@mjt-services/daimon-common-2025";
import { Button, Stack } from "@mui/material";
import { ContentImage } from "../content/ContentImage";

export const AlternativePicker = ({
  content,
  onPick,
  onRemove,
  ...rest
}: {
  content?: Content;
  onPick: (value: Content) => void;
  onRemove: (index: number) => void;
} & Omit<Parameters<typeof Stack>[0], "content">) => {
  if (isUndefined(content?.alternatives)) {
    return <></>;
  }
  return (
    <Stack {...rest}>
      {content.alternatives.map((alt, i) => (
        <Stack key={i} direction={"row"} spacing={1}>
          <Stack border={1} borderColor="grey.400" borderRadius={2} padding={1}>
            <ContentImage
              key={i}
              style={{ maxHeight: "2em", objectFit: "contain" }}
              content={alt}
            />
            <Button
              onClick={() => {
                console.log("set local value to", alt);
                onPick(alt);
              }}
            >
              Use
            </Button>
            <Button
              color="warning"
              onClick={() => {
                onRemove(i);
              }}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
