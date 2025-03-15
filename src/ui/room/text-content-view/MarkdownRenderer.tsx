import { Box, CircularProgress } from "@mui/material";
import type { BoxProps } from "@mui/system";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyBlock } from "./CopyBlock";
import { elementToText } from "./elementToText";

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
        </Box>
      )}
    </Box>
  );
};
