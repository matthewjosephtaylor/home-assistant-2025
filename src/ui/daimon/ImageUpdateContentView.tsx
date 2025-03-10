import { isUndefined } from "@mjt-engine/object";
import type { ReactNode } from "react";
import { FileUpload } from "../common/FileUpload";
import { ContentView } from "../content/ContentView";
import { bytesToContentId } from "./fileToContentId";
import { putContent } from "../common/putContent";

export const ImageUpdateContentView = ({
  contentId,
  onChange,
}: {
  contentId: string | undefined;
  onChange?: (newValue: string) => void;
}) => {
  // if (isUndefined(contentId)) {
  //   return (
  //     <FileUpload
  //       onChange={async function (file): Promise<void> {
  //         console.log("File uploaded", file);
  //         if (isUndefined(file)) {
  //           return;
  //         }
  //         const contentId = await bytesToContentId(file);
  //         console.log("Content ID", contentId);
  //         onChange?.(contentId);
  //       }}
  //       renderFile={function (file: File): ReactNode {
  //         return (
  //           <ContentView
  //             contentType="image/png"
  //             contentId={contentId}
  //             imgProps={{ style: { maxHeight: "8em" } }}
  //           />
  //         );
  //       }}
  //     />
  //   );
  // }
  return (
    <ContentView
      contentType="image/png"
      contentId={contentId}
      onUpdate={async (value) => {
        await putContent(value);
        onChange?.(value.id);
      }}
      imgProps={{ style: { maxHeight: "8em" } }}
    />
  );
};
