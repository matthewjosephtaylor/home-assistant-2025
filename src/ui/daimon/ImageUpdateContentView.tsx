import { isUndefined } from "@mjt-engine/object";
import type { ReactNode } from "react";
import { FileUpload } from "../common/FileUpload";
import { ContentView } from "../ContentView";
import { bytesToContentId } from "./fileToContentId";


export const ImageUpdateContentView = ({
  contentId, onChange,
}: {
  contentId: string | undefined;
  onChange?: (newValue: string) => void;
}) => {
  if (isUndefined(contentId)) {
    // return <div>Upload button go here</div>;
    return (
      <FileUpload
        onChange={async function (file): Promise<void> {
          console.log("File uploaded", file);
          if (isUndefined(file)) {
            return;
          }
          const contentId = await bytesToContentId(file);
          console.log("Content ID", contentId);
          onChange?.(contentId);
        }}
        renderFile={function (file: File): ReactNode {
          return (
            <ContentView
              contentId={contentId}
              imgProps={{ style: { maxHeight: "8em" } }} />
          );
        }} />
    );
  }
  return (
    <ContentView
      contentId={contentId}
      imgProps={{ style: { maxHeight: "8em" } }} />
  );
};
