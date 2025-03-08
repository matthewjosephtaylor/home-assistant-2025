import { isUndefined } from "@mjt-engine/object";
import type { Content } from "@mjt-services/daimon-common-2025";
import { Box, type BoxProps } from "@mui/system";
import { useData } from "../state/useData";
import { ContentImage } from "./ContentImage";
import type { ImgHTMLAttributes } from "react";

export const ContentView = ({
  contentId,
  imgProps,
  ...rest
}: {
  contentId: string | undefined;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "content">;
} & (BoxProps | ImgHTMLAttributes<HTMLImageElement>)) => {
  const content = useData<Content>({ id: contentId });
  if (isUndefined(content)) {
    return <Box {...rest}>Loading...</Box>;
  }
  if (typeof content.value === "string") {
    return <Box {...rest}>{content.value}</Box>;
  }
  if (content.contentType.startsWith("image")) {
    return (
      <Box {...rest}>
        <ContentImage content={content} {...imgProps} />
      </Box>
    );
  }
  return (
    <Box {...rest}>
      type:{content.contentType} creator:{content.creatorId}
    </Box>
  );
};
