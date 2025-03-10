import { Box, CircularProgress, Typography } from "@mui/material";
import type { BoxProps } from "@mui/system";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyBlock } from "./CopyBlock";
import { isUndefined } from "@mjt-engine/object";
import { Element } from "hast";

export const MarkdownRenderer = ({
  text,
  isComplete = true,
  ...rest
}: {
  text: string;
  isComplete?: boolean;
} & BoxProps) => {
  return (
    <Box sx={{ position: "relative", padding: 2 }} {...rest}>
      <Box
        sx={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          "& code": {
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              console.log("node", node);
              console.log("props", props);
              return (
                <CopyBlock text={elementToText(node)}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </CopyBlock>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </Box>
      {!isComplete && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <CircularProgress size={24} />
          <Typography variant="caption" color="textSecondary">
            Loading...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export type HastElement = {
  type: string;
  value?: string;
  children: unknown[];
};

export const elementToText = (element?: HastElement): string => {
  if (isUndefined(element)) {
    return "";
  }
  // if(element.children) {
  //   return element.children.map((child) => elementToText(child)).join("");
  // }
  if (element.children) {
    return element.children
      .map((child) => elementToText(child as HastElement))
      .join("");
  }
  if (element.type === "text") {
    return element.value ?? "";
  }
  return "";
};
