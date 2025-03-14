import { isUndefined } from "@mjt-engine/object";
import type { Content } from "@mjt-services/daimon-common-2025";
import { Box, type BoxProps } from "@mui/system";
import type { ImgHTMLAttributes } from "react";
import { useData } from "../../state/useData";
import { MarkdownRenderer } from "../room/text-content-view/MarkdownRenderer";
import { GenContentImage } from "./GenContentImage";
import type { TextToImageRequest } from "@mjt-services/imagegen-common-2025";

export const ContentView = ({
  contentId,
  imgProps,
  onUpdate,
  contentType,
  defaultImagegenRequest,
  ...rest
}: {
  onUpdate?: (value: Content) => void;
  contentId: string | undefined;
  contentType?: string;
  defaultImagegenRequest?: Partial<TextToImageRequest>;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "content">;
} & (BoxProps | ImgHTMLAttributes<HTMLImageElement>)) => {
  const content = useData<Content>(contentId);
  const realizedContentType = content?.contentType ?? contentType;
  if (
    realizedContentType?.startsWith("text") &&
    typeof content?.value === "string"
  ) {
    return (
      <MarkdownRenderer
        text={content.value}
        isComplete={content.finalized}
        {...rest}
      />
    );
  }
  if (realizedContentType?.startsWith("image")) {
    return (
      <Box {...rest}>
        <GenContentImage
          defaultRequest={defaultImagegenRequest}
          content={content}
          onUpdate={onUpdate}
          {...imgProps}
        />
      </Box>
    );
  }
  return (
    <Box {...rest}>
      type:{content?.contentType ?? "undefined content"} creator:
      {content?.creatorId ?? "undefined creator"}
    </Box>
  );
};
